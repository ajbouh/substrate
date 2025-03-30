import io
import os
import torch
#from typing import Dict, List, Optional, BinaryIO
from parler_tts import ParlerTTSForConditionalGeneration
from transformers import AutoTokenizer
import soundfile as sf

from fastapi import responses, FastAPI
from pydantic import BaseModel

class Request(BaseModel):
    input: str

Response = responses.Response

#class Response(BaseModel):
#    segments: List[bytes]

app = FastAPI(debug=True)

device = "cuda:0" if torch.cuda.is_available() else "cpu"

default_name = "parler-tts/parler-tts-large-v1"
model_repo = os.environ.get("MODEL_REPO", default_name)

model = ParlerTTSForConditionalGeneration.from_pretrained(model_repo).to(device)
tokenizer = AutoTokenizer.from_pretrained(model_repo)

@app.post('/v1/parler-tts')
def speech(request: Request) -> Response:
    prompt = request.input
    description = "Jon's voice is monotone yet slightly fast in delivery, with a very close recording that almost has no background noise."

    input_ids = tokenizer(description, return_tensors="pt").input_ids.to(device)
    prompt_input_ids = tokenizer(prompt, return_tensors="pt").input_ids.to(device)
    generation = model.generate(input_ids=input_ids, prompt_input_ids=prompt_input_ids)
    audio_arr = generation.cpu().numpy().squeeze()

    byte_io = io.BytesIO()
    sf.write(byte_io, audio_arr, model.config.sampling_rate, format='WAV')
    # sf.write("parler_tts_out.wav", audio_arr, model.config.sampling_rate)

    bytes_wav = byte_io.getvalue()

    return Response(content=bytes_wav, media_type="application/octet-stream")
