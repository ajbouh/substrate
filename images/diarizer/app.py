import base64
import sys
import soundfile as sf
# from pydub import AudioSegment
import io
import struct
import json
import torch
import numpy as np
import os

from diarizer import Request, Response, Timespan, new_v1_api_app

from pyannote.audio import Pipeline

pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.1")

# send pipeline to GPU (when available)
import torch
pipeline.to(torch.device("cuda"))

def read_wav(wav: bytes):
    buf = io.BytesIO(wav)
    buf.name = 'file.wav'
    data, samplerate = sf.read(buf, dtype='float32')
    return data, samplerate


def diarize(request: Request) -> Response:
    data = base64.b64decode(request.audio_data)
    audio_wav, sample_rate = read_wav(data)
    audio_data = np.frombuffer(audio_wav, dtype=np.float32)
    print(f'diarize-srv: got {len(audio_data)} samples')
    waveform = torch.from_numpy(audio_data).unsqueeze(0)

    diarization = pipeline(dict(
      waveform=waveform,
      uri="dummy_uri",
      sample_rate=sample_rate,
      delta_new=0.57
    ))

    segments = diarization.itertracks(yield_label=True)

    return Response(
        timespans=[
            Timespan(
                start=segment.start,
                end=segment.end,
                speaker=speaker,
            )
            for segment, _, speaker in segments
        ],
    )

app = new_v1_api_app(diarize=diarize)
