from bridge.transcript import DiarizationRequest, DiarizationResponse, DiarizationSegment, new_v1_api_app
import os
from pyannote.audio import Pipeline
import torch

# Need to request access to pyannote/speaker-diarization and pyannote/segmentation
MODEL_NAME = os.environ.get("MODEL_NAME", "pyannote/speaker-diarization@2.1")
HF_AUTH_TOKEN = os.environ.get("HF_AUTH_TOKEN", None)
MODEL_DEVICE = torch.device(os.environ.get("MODEL_DEVICE", "cpu"))

model = Pipeline.from_pretrained(MODEL_NAME, use_auth_token=HF_AUTH_TOKEN).to(MODEL_DEVICE)

def diarize(request: DiarizationRequest) -> DiarizationResponse:
    n_samples = len(request.audio.waveform)
    audio_data = {
        # 'waveform': torch.from_numpy(audio[None, :]),
        'waveform': torch.cuda.FloatTensor([request.audio.waveform]).reshape(n_samples, 1),
        'sample_rate': request.audio.sample_Rate,
    }
    segments = model(audio_data, min_speakers=request.min_speakers, max_speakers=request.max_speakers)
    return DiarizationResponse(
        segments=[
            DiarizationSegment(
                start=segment.start,
                end=segment.end,
                track=track,
                label=label,
            )
            for segment, track, label in segments.itertracks(yield_label=True)
        ]
    )

app = new_v1_api_app(
    diarize=diarize,
)
