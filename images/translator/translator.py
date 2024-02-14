import time
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, List, Optional, Callable

class Word(BaseModel):
    start: float
    end: float
    word: str
    prob: float

class Segment(BaseModel):
    id: Optional[int]
    seek: Optional[int]
    start: Optional[float]
    end: Optional[float]

    speaker: Optional[str]

    text: Optional[str]
    # tokens: List[int]
    temperature: Optional[float]
    avg_logprob: Optional[float]
    compression_ratio: Optional[float]
    no_speech_prob: Optional[float]
    words: Optional[List[Word]]

    audio_data: Optional[bytes]

class Response(BaseModel):
    source_language: Optional[str]
    source_language_prob: Optional[float]
    target_language: Optional[str]
    duration: Optional[float]
    all_language_probs: Optional[Dict[str, float]]

    segments: List[Segment]



class Request(BaseModel):
    audio_data: Optional[bytes]
    task: str

    source_language: Optional[str]
    target_language: Optional[str]
    text: Optional[str]
    segments: Optional[Segment]

def new_v1_api_app(
        transcribe: Optional[Callable[[Request], Response]]=None,
    ):
    app = FastAPI()

    if transcribe:
        @app.post('/v1/transcribe')
        def do_transcribe(request: Request) -> Response:
            # Perform transcription on the audio data

            start = time.time()
            transcription = transcribe(request)
            end = time.time()

            print("Took:", end - start)
            return transcription
    
    
    return app
