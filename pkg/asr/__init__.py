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

# class TranscriptionOptions(BaseModel):
#     beam_size: int
#     best_of: int
#     patience: float
#     length_penalty: float
#     repetition_penalty: float
#     log_prob_threshold: Optional[float]
#     no_speech_threshold: Optional[float]
#     compression_ratio_threshold: Optional[float]
#     condition_on_previous_text: bool
#     prompt_reset_on_temperature: float
#     temperatures: List[float]
#     initial_prompt: Optional[Union[str, Iterable[int]]]
#     prefix: Optional[str]
#     suppress_blank: bool
#     suppress_tokens: Optional[List[int]]
#     without_timestamps: bool
#     max_initial_timestamp: float
#     word_timestamps: bool
#     prepend_punctuations: str
#     append_punctuations: str

class Request(BaseModel):
    audio_data: Optional[bytes]
    task: str

    source_language: Optional[str]
    target_language: Optional[str]
    text: Optional[str]
    segments: Optional[Segment]


class DiarizationSegment(BaseModel):
    start: float
    end: float
    track: int
    label: str

class DiarizationRequest(BaseModel):
    audio_data: Optional[bytes]
    task: str
    segments: Optional[DiarizationSegment]

class DiarizationResponse(BaseModel):
    segments: List[DiarizationSegment]

def new_v1_api_app(
        diarize: Optional[Callable[[DiarizationRequest], DiarizationResponse]]=None,
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
    
    if diarize:
        @app.post('/v1/diarize')
        def do_diarize(request: DiarizationRequest) -> DiarizationResponse:
            # Perform transcription on the audio data

            start = time.time()
            transcription = diarize(request)
            end = time.time()

            print("Took:", end - start)
            return transcription
    
    return app
