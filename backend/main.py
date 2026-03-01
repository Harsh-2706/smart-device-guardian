from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psutil
import os
import winreg
from collections import deque
import time
import shutil

app = FastAPI()

# Configuration & State
WHITELIST = ["System", "wininit.exe", "explorer.exe", "taskmgr.exe", "python.exe", "uvicorn.exe"]
MAX_MEMORY_LOG = 10
optimization_log = deque(maxlen=MAX_MEMORY_LOG)
cpu_history = deque(maxlen=10)
psutil.cpu_percent(interval=None) # Init

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize psutil counters for non-blocking delta measurements
psutil.cpu_percent(interval=None)

# Caching expensive scans
_context_cache = {"value": "General Mode", "time": 0}

def get_context():
    global _context_cache
    now = time.time()
    if now - _context_cache["time"] < 1.5:  # Cache for 1.5s
        return _context_cache["value"]
        
    try:
        names = [p.info['name'].lower() for p in psutil.process_iter(['name'])]
        if any(x in n for n in names for x in ['vscode', 'code.exe', 'python', 'node']):
            res = "Coding Mode"
        elif any(x in n for n in names for x in ['zoom', 'teams', 'slack']):
            res = "Meeting Mode"
        elif any(x in n for n in names for x in ['chrome', 'firefox', 'edge']):
            res = "Browsing Mode"
        else:
            res = "General Mode"
        _context_cache = {"value": res, "time": now}
        return res
    except:
        return _context_cache["value"]

def get_behavior(cpu, ram, disk, procs):
    if cpu > 70: return "Compute-Heavy"
    if ram > 80: return "Memory-Heavy"
    if disk > 50: return "I/O-Heavy"
    if procs > 250: return "Process-Heavy"
    return "Balanced"

def get_strategy(context, behavior, health):
    if context == "Coding Mode" and behavior == "Memory-Heavy":
        return "Development Resource Preservation"
    if context == "Meeting Mode" and health < 70:
        return "Communication Stability Priority"
    if behavior == "Compute-Heavy":
        return "Active Load Balancing"
    return "Standard Optimization"

# Non-blocking disk tracking
_last_io = {"stats": psutil.disk_io_counters(), "time": time.time()}

@app.get("/metrics")
def metrics():
    global _last_io
    cpu = psutil.cpu_percent(interval=None)
    cpu_history.append(cpu)
    ram = psutil.virtual_memory().percent
    
    now = time.time()
    io_now = psutil.disk_io_counters()
    time_delta = now - _last_io["time"]
    
    if time_delta > 0:
        read_mb = (io_now.read_bytes - _last_io["stats"].read_bytes) / 1024 / 1024 / time_delta
        write_mb = (io_now.write_bytes - _last_io["stats"].write_bytes) / 1024 / 1024 / time_delta
        disk_activity = min(100.0, (read_mb + write_mb) * 2)
    else:
        disk_activity = 0
    _last_io = {"stats": io_now, "time": now}
    
    processes = len(psutil.pids())
    context_mode = get_context()
    behavior = get_behavior(cpu, ram, disk_activity, processes)
    health = max(0, min(100, int(100 - max(cpu, ram, disk_activity))))
    
    avg_cpu = sum(cpu_history)/len(cpu_history) if cpu_history else 0
    spike = cpu > (avg_cpu + 20) and len(cpu_history) > 5

    impact_impact = 0
    if optimization_log:
        impact_impact = sum(x['improvement'] for x in optimization_log) / len(optimization_log)

    return {
        "cpu": cpu,
        "ram": ram,
        "disk": disk_activity,
        "processes": processes,
        "health_score": health,
        "context_mode": context_mode,
        "system_behavior": behavior,
        "optimization_strategy": get_strategy(context_mode, behavior, health),
        "optimization_confidence": min(95, max(cpu, ram, disk_activity)),
        "optimization_impact_score": round(impact_impact, 1),
        "spike_detected": spike
    }

@app.post("/action/clear-temp")
def clear_temp():
    temp_dir = os.environ.get('TEMP')
    count = 0
    if temp_dir and os.path.exists(temp_dir):
        for filename in os.listdir(temp_dir):
            file_path = os.path.join(temp_dir, filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)
                    count += 1
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
                    count += 1
            except Exception:
                pass
    return {"message": f"Cleared {count} temporary items", "count": count}

@app.post("/action/reduce-priority")
def reduce_priority():
    target = None
    max_cpu = 0
    cpu_before = psutil.cpu_percent(interval=0.1)
    
    for proc in psutil.process_iter(['name', 'cpu_percent']):
        try:
            if proc.info['name'] not in WHITELIST and proc.info['cpu_percent'] > max_cpu:
                max_cpu = proc.info['cpu_percent']
                target = proc
        except: continue
        
    if target:
        try:
            target.nice(psutil.BELOW_NORMAL_PRIORITY_CLASS)
            time.sleep(0.5)
            cpu_after = psutil.cpu_percent(interval=0.1)
            improvement = max(0, cpu_before - cpu_after)
            optimization_log.append({"action": "priority", "improvement": improvement})
            return {"message": f"Reduced priority for {target.name()}", "success": True}
        except:
            return {"message": "Access denied or process ended", "success": False}
    return {"message": "No suitable process found", "success": False}

_top_cache = {"value": [], "time": 0}

@app.get("/top-processes")
def top_processes():
    global _top_cache
    now = time.time()
    # Cache for 2 seconds to drastically reduce system load
    if now - _top_cache["time"] < 2.0:
        return {"top": _top_cache["value"]}
        
    procs = []
    # Fast non-blocking scan
    for proc in psutil.process_iter(['name', 'cpu_percent', 'memory_percent']):
        try:
            # interval=None returns delta since last call on this specific proc object
            # across multiple requests, this eventually stabilizes
            pinfo = proc.info
            if pinfo['name'] not in WHITELIST:
                procs.append(pinfo)
        except: continue
            
    # Return top 10 by memory as a proxy for high-intensity apps
    top_apps = sorted(procs, key=lambda x: x['memory_percent'], reverse=True)[:10]
    _top_cache = {"value": top_apps, "time": now}
    return {"top": top_apps}

@app.get("/startup-items")
def startup_items():
    items = []
    # Registry paths for startup
    registry_paths = [
        (winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Run"),
        (winreg.HKEY_LOCAL_MACHINE, r"Software\Microsoft\Windows\CurrentVersion\Run")
    ]
    
    for root, path in registry_paths:
        try:
            with winreg.OpenKey(root, path) as key:
                count = winreg.QueryInfoKey(key)[1]
                for i in range(count):
                    name, value, _ = winreg.EnumValue(key, i)
                    items.append({
                        "name": name,
                        "path": value,
                        "impact": "High" if "electron" in value.lower() or "chrome" in value.lower() else "Medium",
                        "enabled": True
                    })
        except WindowsError:
            continue
            
    return {"items": items[:8]} # Return top 8

@app.get("/risk-assessment")
def risk_assessment():
    risks = []
    for proc in psutil.process_iter(['name', 'exe', 'cpu_percent']):
        try:
            # Simple risk logic: No executable path or running from Temp
            if not proc.info['exe']:
                risks.append({
                    "name": proc.info['name'],
                    "level": "Warning",
                    "reason": "Unknown Origin",
                    "threat": "Low"
                })
            elif "temp" in proc.info['exe'].lower():
                risks.append({
                    "name": proc.info['name'],
                    "level": "Critical",
                    "reason": "Running from Temp",
                    "threat": "High"
                })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
            
    return {"risks": risks[:5]}
