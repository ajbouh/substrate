import os
import io
from styletts2 import tts
from fastapi import FastAPI, Response
from pydantic import BaseModel
from typing import Optional

class Request(BaseModel):
    input: str
    response_format: Optional[str]

app = FastAPI(debug=True)

model_dir = os.environ['MODEL']

tts_model = tts.StyleTTS2(
    model_checkpoint_path=model_dir + '/Models/LibriTTS/epochs_2nd_00020.pth',
    config_path=model_dir + '/Models/LibriTTS/config.yml',
)

@app.post('/v1/speech')
def speech(request: Request) -> Response:
    f = io.BytesIO(bytes())
    audio = tts_model.inference(
        text=request.input,
        output_sample_rate=24000,
        alpha=0.3,
        beta=0.7,
        diffusion_steps=5,
        embedding_scale=1,
        output_wav_file=f,
    )
    return Response(media_type="audio/wav", content=f.getvalue())
