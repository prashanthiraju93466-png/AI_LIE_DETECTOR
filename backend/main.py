from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import random
import time
import asyncio

app = FastAPI(title="AI Lie Detector Backend API")

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "AI Lie Detector Engine is Live"}

@app.post("/analyze")
async def analyze_chunk(video: UploadFile = File(None), audio: UploadFile = File(None)):
    """
    Endpoint that accepts chunks of video and/or audio from the frontend
    and runs them through the 'Multimodal Machine Learning Model'.
    """
    
    # In a real model, we would save the blob, run cv2.VideoCapture / librosa, and return metrics.
    # Currently simulating the processing required by "Micro-Expression and Voice Analysis for Deception Detection"
    
    # Simulated processing delay for heavy ML models
    await asyncio.sleep(0.4)
    
    # 1. Visual Feature Module
    possible_exp = [
        'Micro-Fear (30ms)', 
        'Contempt Bias', 
        'Asymmetrical Lip Tightening', 
        'Baseline (Neutral)', 
        'Blink Rate Spike', 
        'Gaze Aversion', 
        'Jaw Clench', 
        'Eye Dilation'
    ]
    detected_expression = random.choice(possible_exp)
    
    # 2. Audio Feature Module (Pitch, Jitter, Shimmer)
    pitch = round(random.uniform(105, 140), 1)
    jitter = round(random.uniform(0.2, 1.2), 2)
    shimmer = round(random.uniform(1.0, 3.5), 2)
    
    # 3. Multimodal ML Model Fusion (Deception Score)
    # Fluctuate deception score randomly for prototyping
    score = round(random.uniform(10, 85), 1)
    
    # Adjust score if fearful expression detected
    if 'Fear' in detected_expression or 'Aversion' in detected_expression:
        score = min(score + 15, 99.0)

    ai_confidence = round(random.uniform(88.0, 97.5), 1)

    return {
        "status": "success",
        "timestamp": time.time(),
        "deception_score": score,
        "ai_confidence": ai_confidence,
        "expressions": [detected_expression],
        "audio_metrics": {
            "pitch": f"{pitch}Hz",
            "jitter": f"{jitter}%",
            "shimmer": f"{shimmer}%"
        }
    }
