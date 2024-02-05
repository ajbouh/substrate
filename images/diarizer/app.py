import sys
import soundfile as sf
from pydub import AudioSegment
import io
import struct
import json
import torch
import numpy as np
import os

from transcriber import Request, Response, Segment, Word, new_v1_api_app

from pyannote.audio import Pipeline

pipeline = Pipeline.from_pretrained(
    "pyannote/speaker-diarization-3.1",
    use_auth_token="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") # progrium's token for now

# send pipeline to GPU (when available)
#import torch
#pipeline.to(torch.device("cuda"))

def process_audio(buffer):
    audio_data = np.frombuffer(buffer, dtype=np.float32)

    diarization = pipeline(dict(
      waveform=torch.from_numpy(audio_data).unsqueeze(0), 
      uri="dummy_uri", 
      sample_rate=16000,
      delta_new=0.57
    ))

    timespans = [
        {"speaker": speaker, "start": segment.start, "end": segment.end}
        for segment, _, speaker in diarization.itertracks(yield_label=True)
    ]

    return json.dumps(timespans)


def transcribe(request: Request) -> Response:
    data = base64.b64decode(request.audio_data)
    #waveform, sample_rate = ogg2wav(data)

    segments, info = model.transcribe(
        io.BytesIO(data),
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
