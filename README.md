# Smart Device Guardian: Workflow-Aware AI Performance Copilot

## Overview
Smart Device Guardian is a high-performance, local-first orchestration engine designed to transcend traditional system monitoring. Unlike standard task managers that provide static data, this system implements workflow-aware intelligence to proactively manage system resources based on real-time user activity and system behavior profiles. 

The architecture leverages a FastAPI-driven backend for high-frequency telemetry and a React-based fluid interface for real-time visualization, ensuring a zero-latency feedback loop for system optimization.

## Key Features
*   **Workflow Context Detection**: Real-time identification of user activities (Coding, Browsing, Meeting, Gaming) to tailor optimization strategies.
*   **Behavior Classification Engine**: Multi-dimensional analysis of CPU, RAM, and Disk telemetry to classify system state into profiles like Compute-Heavy or I/O-Heavy.
*   **Dynamic Health Metrics**: Proprietary algorithms for calculating System Health, Stability, and Efficiency indices.
*   **Proactive Action Engine**: Safe, user-validated automation for process priority adjustment and non-critical system cleanup.
*   **Optimization Impact Tracking**: Statistical analysis of system state improvements following administrative actions.
*   **Privacy-First Architecture**: All data processing, classification, and telemetry remain strictly local to the host machine.

## Technical Architecture

### Context-Aware Detection
The context engine monitors the process tree using a sliding window approach. It identifies operational modes by mapping active binaries and their resource signatures to high-level workflow profiles. This ensures that the system understands *what* the user is doing, not just *what* the hardware is doing.

### Behavior Classification Engine
The system employs a weighted heuristic classification model that analyzes:
*   CPU load deltas and spike frequency.
*   Memory saturation and paging risk.
*   Disk I/O throughput and latency.
*   Process count and thread density.

These inputs are transformed into a Behavior Profile that dictates the "Recommended Strategy" displayed in the dashboard.

### Safe Automation Layer
The Proactive Action Engine operates on a "User-in-the-Loop" philosophy. It identifies bottlenecks and generates specific optimization calls (e.g., reducing thread priority for background tasks) which are presented as actionable triggers requiring explicit user validation before execution.

## Setup Instructions

### Backend (FastAPI)
1. Ensure Python 3.9+ is installed.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the telemetry server:
   ```bash
   python -m uvicorn main:app --reload
   ```

### Frontend (React + Vite)
1. Navigate to the project root or frontend directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the dashboard:
   ```bash
   npm run dev
   ```

## Privacy & Safety
Smart Device Guardian is built with a core focus on system stability and data sovereignty.
*   **No External Telemetry**: No system data ever leaves the local environment.
*   **Critical Whitelist**: System-essential processes and core OS kernels are strictly protected from priority modifications.
*   **Non-Destructive Cleanup**: Temporary file cleanup targets only safe-to-delete user directories.

## Future Roadmap
*   Support for advanced GPU telemetry and thermal throttling detection.
*   Local LLM integration for more nuanced natural language suggestions.
*   Automated "Night Cycle" optimizations for background maintenance.

## License
Distributed under the MIT License. See `LICENSE` for more information.

Copyright (c) 2026 Smart Device Guardian
