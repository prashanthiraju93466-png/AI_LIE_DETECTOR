# AI Lie Detector: Multimodal Analysis System

This is the complete frontend and backend architecture for the AI Lie Detector, which uses video and audio capture to simulate real-time multimodal deep learning processing based on Facial Action Coding System (FACS) and audio metrics (Pitch, Jitter, Shimmer).

## Project Architecture

- **Frontend:** React (powered by Vite). Captures the webcam and microphone, breaks them into small chunks, and visualizes the ML analysis stream on a glass-morphic UI.
- **Backend:** Python (FastAPI). Accepts incoming chunks via an HTTP API, runs simulated deep learning models, and returns JSON containing deception metrics.

---

## How to Run in Visual Studio Code (VS Code)

To run the full-stack project, you need to open two separate terminals in VS Code.
If you don't know how to open a terminal, press `Ctrl` + `~` (or `Cmd` + `~` on Mac), or go to **Terminal > New Terminal** in the top menu.

### 1. Start the React Frontend
In your **first terminal**, make sure you are in the root directory `AI_LIE_DETECTOR`, and run:

```bash
npm install
npm run dev
```
*Your frontend will now be running on `http://localhost:5173`. You can Ctrl+Click the link in the terminal to open it.*

### 2. Start the Python FastAPI Backend
Open a **second terminal** in VS Code (click the `+` icon or split screen icon in the terminal window), and run the following commands to navigate to the backend, activate the python environment, and start the API:

```powershell
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload
```
*Your backend will now be live on `http://127.0.0.1:8000/` and waiting for analysis requests.*

---

## Using the Application
1. Open Google Chrome or Firefox and navigate to `http://localhost:5173`.
2. Click **"Initialize Session & Record"**.
3. It will prompt your browser for camera and microphone permissions. Please allow them.
4. Speak to the camera. The system will slice your audio and video every 2.5 seconds, send it to the Python backend, and your UI will be updated dynamically with the exact ML metrics!
