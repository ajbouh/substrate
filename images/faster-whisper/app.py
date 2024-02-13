import numpy as np
from faster_whisper import WhisperModel
import os

from transcriber import Request, Response, Segment, Word, new_v1_api_app

import base64
import io
import soundfile as sf

def read_waveform(request: Request):
    metadata = request.audio_metadata
    data = base64.b64decode(request.audio_data)
    buf = io.BytesIO(data)
    if metadata and metadata.mime_type == 'audio/opus':
        buf.name = 'file.opus'
    else:
        buf.name = 'file.wav'

    dtype = 'float32'
    samplerate = metadata.sample_rate if metadata and metadata.sample_rate else None
    channels = metadata.channels if metadata and metadata.channels else None

    waveform, samplerate = sf.read(buf, dtype=dtype, channels=channels, samplerate=samplerate)
    return waveform, samplerate

model = WhisperModel(
    os.environ.get("MODEL_REPO", "tiny"),
    device=os.environ.get("MODEL_DEVICE", "cpu"),
    compute_type=os.environ.get("MODEL_COMPUTE_TYPE", "int8"),
    local_files_only=True,
)

def transcribe(request: Request) -> Response:
    waveform, sample_rate = read_waveform(request)

    segments, info = model.transcribe(
        waveform,
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

app = new_v1_api_app(transcribe=transcribe)
