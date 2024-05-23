import time
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, List, Optional, Callable

class Timespan(BaseModel):
    start: float
    end: float
    speaker: str


class Response(BaseModel):
    timespans: List[Timespan]


class Request(BaseModel):
    audio_data: bytes


def new_v1_api_app(
        diarize: Optional[Callable[[Request], Response]]=None,
    ):
    app = FastAPI()

    if diarize:
        @app.post('/v1/diarize')
        def do_diarize(request: Request) -> Response:
            start = time.time()
            diarization = diarize(request)
            end = time.time()

            print("Took:", end - start)
            return diarization

    return app
