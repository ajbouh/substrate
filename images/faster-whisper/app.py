from contextlib import contextmanager
import base64
import io
import os
import tempfile
from typing import Dict, List, Optional, BinaryIO
import urllib.request

from fastapi import FastAPI
from faster_whisper import WhisperModel
from pydantic import BaseModel
import torchaudio

@contextmanager
def download_url_to_tempfile(url, suffix):
    with tempfile.NamedTemporaryFile(suffix=suffix) as tmp_file:
        with urllib.request.urlopen(url) as response:
            while True:
                chunk = response.read(8192)  # Read in 8KB chunks
                if not chunk:
                    break
                tmp_file.write(chunk)
        tmp_file.flush()

        yield tmp_file.name

def torchaudio_load_url_or_data(
    mime_type: Optional[str] = None,
    url: Optional[str] = None,
    base64_data: Optional[str] = None,
):
    format = None
    if mime_type == 'audio/opus':
        format = 'ogg'
    elif mime_type == 'audio/ogg':
        format = 'ogg'
    elif mime_type == 'audio/wav':
        format = 'wav'        

    if url:
        suffix = "." + format if format else None
        with download_url_to_tempfile(url, suffix=suffix) as f:
            return torchaudio.load(f, format=format)
    else:
        if not format:
            raise Exception("unknown mime_type")

        data = base64.b64decode(base64_data)
        input: BinaryIO = io.BytesIO(data)
        return torchaudio.load(input, format=format)


def read_audio(request: Request):
    sampling_rate = 16000
    split_stereo = False
    waveform, audio_sf = torchaudio_load_url_or_data(
        mime_type=request.audio_metadata.mime_type if request.audio_metadata else None,
        url=request.audio_url,
        base64_data=request.audio_data,
    )

    if audio_sf != sampling_rate:
        waveform = torchaudio.functional.resample(
            waveform, orig_freq=audio_sf, new_freq=sampling_rate
        )

    if split_stereo:
        return waveform[0], waveform[1]

    return waveform.mean(0)

model = WhisperModel(
    os.environ.get("MODEL_REPO", "tiny"),
    device=os.environ.get("MODEL_DEVICE", "cpu"),
    compute_type=os.environ.get("MODEL_COMPUTE_TYPE", "int8"),
    local_files_only=True,
)

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


class AudioMetadata(BaseModel):
    mime_type: Optional[str]
    sample_rate: Optional[int]
    channels: Optional[int]

class Request(BaseModel):
    audio_data: Optional[bytes]
    audio_url: Optional[str]
    audio_metadata: Optional[AudioMetadata]
    task: str

    source_language: Optional[str]
    target_language: Optional[str]
    text: Optional[str]
    segments: Optional[Segment]

app = FastAPI(debug=True)

@app.post('/v1/transcribe')
def transcribe(request: Request) -> Response:
    audio = read_audio(request)
    segments, info = model.transcribe(
        # in the next version faster-whisper we should be able to pass the tensor directly.
        audio.numpy(),
        vad_filter=True,
        beam_size=5,
        word_timestamps=True,
        task=request.task,
    )

    return Response(
        source_language=info.language,
        source_language_prob=info.language_probability,
        target_language=info.language,
        duration=info.duration,
        all_language_probs={
            language: prob
            for language, prob in info.all_language_probs
        } if info.all_language_probs else None,
        segments=[
            Segment(
                id=segment.id,
                seek=segment.seek,
                start=segment.start,
                end=segment.end,
                text=segment.text,
                temperature=segment.temperature,
                avg_logprob=segment.avg_logprob,
                compression_ratio=segment.compression_ratio,
                no_speech_prob=segment.no_speech_prob,
                words=[
                    Word(
                        start=word.start,
                        end=word.end,
                        word=word.word,
                        prob=word.probability,
                    )
                    for word in segment.words
                ] if segment.words else None,
            )
            for segment in segments
        ],
    )
