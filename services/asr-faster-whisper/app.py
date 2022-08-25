import numpy as np
from faster_whisper import WhisperModel
import os

from bridge.transcript import TranscriptionRequest, TranscriptionResponse, TranscriptionSegment, Word, new_v1_api_app

model = WhisperModel(
    os.environ.get("MODEL_SIZE", "small"),
    device=os.environ.get("MODEL_DEVICE", "cpu"),
    compute_type=os.environ.get("MODEL_COMPUTE_TYPE", "int8"),
    # local_files_only=True,
)

def transcribe(request: TranscriptionRequest) -> TranscriptionResponse:
    segments, info = model.transcribe(
        np.array(request.audio.waveform, dtype=np.float32),
        vad_filter=True,
        beam_size=5,
        word_timestamps=True,
        task=request.task,
    )

    return TranscriptionResponse(
        source_language=info.language,
        source_language_prob=info.language_probability,
        target_language=info.language,
        duration=info.duration,
        all_language_probs={
            language: prob
            for language, prob in info.all_language_probs
        } if info.all_language_probs else None,
        segments=[
            TranscriptionSegment(
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
