import torch
from seamless_communication.models.inference import Translator
import os

from bridge.transcript import TranscriptionRequest, TranscriptionResponse, TranscriptionSegment, Word, new_v1_api_app

MODEL_DEVICE = os.environ.get("MODEL_DEVICE", "cpu")
MODEL_COMPUTE_TYPE = os.environ.get("MODEL_COMPUTE_TYPE", "float32")

model = Translator(
    os.environ.get("MODEL_SIZE", "seamlessM4T_large"),
    vocoder_name_or_card="vocoder_36langs",
    device=torch.device(MODEL_DEVICE),
    dtype={
        'float32': torch.float32,
        'float64': torch.float64,
        'bfloat16': torch.bfloat16,
        'int8': torch.int8,
    }[MODEL_COMPUTE_TYPE],
)

supported = {
    "afr": {"label": "Afrikaans",              "script": "Latn"}, #       | Sp, Tx | Tx     |
    "amh": {"label": "Amharic",                "script": "Ethi"}, #       | Sp, Tx | Tx     |
    "arb": {"label": "Modern Standard Arabic", "script": "Arab"}, #       | Sp, Tx | Sp, Tx |
    "ary": {"label": "Moroccan Arabic",        "script": "Arab"}, #       | Sp, Tx | Tx     |
    "arz": {"label": "Egyptian Arabic",        "script": "Arab"}, #       | Sp, Tx | Tx     |
    "asm": {"label": "Assamese",               "script": "Beng"}, #       | Sp, Tx | Tx     |
    "ast": {"label": "Asturian",               "script": "Latn"}, #       | Sp     | \--    |
    "azj": {"label": "North Azerbaijani",      "script": "Latn"}, #       | Sp, Tx | Tx     |
    "bel": {"label": "Belarusian",             "script": "Cyrl"}, #       | Sp, Tx | Tx     |
    "ben": {"label": "Bengali",                "script": "Beng"}, #       | Sp, Tx | Sp, Tx |
    "bos": {"label": "Bosnian",                "script": "Latn"}, #       | Sp, Tx | Tx     |
    "bul": {"label": "Bulgarian",              "script": "Cyrl"}, #       | Sp, Tx | Tx     |
    "cat": {"label": "Catalan",                "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "ceb": {"label": "Cebuano",                "script": "Latn"}, #       | Sp, Tx | Tx     |
    "ces": {"label": "Czech",                  "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "ckb": {"label": "Central Kurdish",        "script": "Arab"}, #       | Sp, Tx | Tx     |
    "cmn": {"label": "Mandarin Chinese",       "script": "Hans"}, #       | Sp, Tx | Sp, Tx |
    "cmn_Hant": {"label": "Mandarin Chinese",  "script": "Hant"}, #       | Sp, Tx | Sp, Tx |
    "cym": {"label": "Welsh",                  "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "dan": {"label": "Danish",                 "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "deu": {"label": "German",                 "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "ell": {"label": "Greek",                  "script": "Grek"}, #       | Sp, Tx | Tx     |
    "eng": {"label": "English",                "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "est": {"label": "Estonian",               "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "eus": {"label": "Basque",                 "script": "Latn"}, #       | Sp, Tx | Tx     |
    "fin": {"label": "Finnish",                "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "fra": {"label": "French",                 "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "gaz": {"label": "West Central Oromo",     "script": "Latn"}, #       | Sp, Tx | Tx     |
    "gle": {"label": "Irish",                  "script": "Latn"}, #       | Sp, Tx | Tx     |
    "glg": {"label": "Galician",               "script": "Latn"}, #       | Sp, Tx | Tx     |
    "guj": {"label": "Gujarati",               "script": "Gujr"}, #       | Sp, Tx | Tx     |
    "heb": {"label": "Hebrew",                 "script": "Hebr"}, #       | Sp, Tx | Tx     |
    "hin": {"label": "Hindi",                  "script": "Deva"}, #       | Sp, Tx | Sp, Tx |
    "hrv": {"label": "Croatian",               "script": "Latn"}, #       | Sp, Tx | Tx     |
    "hun": {"label": "Hungarian",              "script": "Latn"}, #       | Sp, Tx | Tx     |
    "hye": {"label": "Armenian",               "script": "Armn"}, #       | Sp, Tx | Tx     |
    "ibo": {"label": "Igbo",                   "script": "Latn"}, #       | Sp, Tx | Tx     |
    "ind": {"label": "Indonesian",             "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "isl": {"label": "Icelandic",              "script": "Latn"}, #       | Sp, Tx | Tx     |
    "ita": {"label": "Italian",                "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "jav": {"label": "Javanese",               "script": "Latn"}, #       | Sp, Tx | Tx     |
    "jpn": {"label": "Japanese",               "script": "Jpan"}, #       | Sp, Tx | Sp, Tx |
    "kam": {"label": "Kamba",                  "script": "Latn"}, #       | Sp     | \--    |
    "kan": {"label": "Kannada",                "script": "Knda"}, #       | Sp, Tx | Tx     |
    "kat": {"label": "Georgian",               "script": "Geor"}, #       | Sp, Tx | Tx     |
    "kaz": {"label": "Kazakh",                 "script": "Cyrl"}, #       | Sp, Tx | Tx     |
    "kea": {"label": "Kabuverdianu",           "script": "Latn"}, #       | Sp     | \--    |
    "khk": {"label": "Halh Mongolian",         "script": "Cyrl"}, #       | Sp, Tx | Tx     |
    "khm": {"label": "Khmer",                  "script": "Khmr"}, #       | Sp, Tx | Tx     |
    "kir": {"label": "Kyrgyz",                 "script": "Cyrl"}, #       | Sp, Tx | Tx     |
    "kor": {"label": "Korean",                 "script": "Kore"}, #       | Sp, Tx | Sp, Tx |
    "lao": {"label": "Lao",                    "script": "Laoo"}, #       | Sp, Tx | Tx     |
    "lit": {"label": "Lithuanian",             "script": "Latn"}, #       | Sp, Tx | Tx     |
    "ltz": {"label": "Luxembourgish",          "script": "Latn"}, #       | Sp     | \--    |
    "lug": {"label": "Ganda",                  "script": "Latn"}, #       | Sp, Tx | Tx     |
    "luo": {"label": "Luo",                    "script": "Latn"}, #       | Sp, Tx | Tx     |
    "lvs": {"label": "Standard Latvian",       "script": "Latn"}, #       | Sp, Tx | Tx     |
    "mai": {"label": "Maithili",               "script": "Deva"}, #       | Sp, Tx | Tx     |
    "mal": {"label": "Malayalam",              "script": "Mlym"}, #       | Sp, Tx | Tx     |
    "mar": {"label": "Marathi",                "script": "Deva"}, #       | Sp, Tx | Tx     |
    "mkd": {"label": "Macedonian",             "script": "Cyrl"}, #       | Sp, Tx | Tx     |
    "mlt": {"label": "Maltese",                "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "mni": {"label": "Meitei",                 "script": "Beng"}, #       | Sp, Tx | Tx     |
    "mya": {"label": "Burmese",                "script": "Mymr"}, #       | Sp, Tx | Tx     |
    "nld": {"label": "Dutch",                  "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "nno": {"label": "Norwegian Nynorsk",      "script": "Latn"}, #       | Sp, Tx | Tx     |
    "nob": {"label": "Norwegian Bokmål",       "script": "Latn"}, #       | Sp, Tx | Tx     |
    "npi": {"label": "Nepali",                 "script": "Deva"}, #       | Sp, Tx | Tx     |
    "nya": {"label": "Nyanja",                 "script": "Latn"}, #       | Sp, Tx | Tx     |
    "oci": {"label": "Occitan",                "script": "Latn"}, #       | Sp     | \--    |
    "ory": {"label": "Odia",                   "script": "Orya"}, #       | Sp, Tx | Tx     |
    "pan": {"label": "Punjabi",                "script": "Guru"}, #       | Sp, Tx | Tx     |
    "pbt": {"label": "Southern Pashto",        "script": "Arab"}, #       | Sp, Tx | Tx     |
    "pes": {"label": "Western Persian",        "script": "Arab"}, #       | Sp, Tx | Sp, Tx |
    "pol": {"label": "Polish",                 "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "por": {"label": "Portuguese",             "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "ron": {"label": "Romanian",               "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "rus": {"label": "Russian",                "script": "Cyrl"}, #       | Sp, Tx | Sp, Tx |
    "slk": {"label": "Slovak",                 "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "slv": {"label": "Slovenian",              "script": "Latn"}, #       | Sp, Tx | Tx     |
    "sna": {"label": "Shona",                  "script": "Latn"}, #       | Sp, Tx | Tx     |
    "snd": {"label": "Sindhi",                 "script": "Arab"}, #       | Sp, Tx | Tx     |
    "som": {"label": "Somali",                 "script": "Latn"}, #       | Sp, Tx | Tx     |
    "spa": {"label": "Spanish",                "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "srp": {"label": "Serbian",                "script": "Cyrl"}, #       | Sp, Tx | Tx     |
    "swe": {"label": "Swedish",                "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "swh": {"label": "Swahili",                "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "tam": {"label": "Tamil",                  "script": "Taml"}, #       | Sp, Tx | Tx     |
    "tel": {"label": "Telugu",                 "script": "Telu"}, #       | Sp, Tx | Sp, Tx |
    "tgk": {"label": "Tajik",                  "script": "Cyrl"}, #       | Sp, Tx | Tx     |
    "tgl": {"label": "Tagalog",                "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "tha": {"label": "Thai",                   "script": "Thai"}, #       | Sp, Tx | Sp, Tx |
    "tur": {"label": "Turkish",                "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "ukr": {"label": "Ukrainian",              "script": "Cyrl"}, #       | Sp, Tx | Sp, Tx |
    "urd": {"label": "Urdu",                   "script": "Arab"}, #       | Sp, Tx | Sp, Tx |
    "uzn": {"label": "Northern Uzbek",         "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "vie": {"label": "Vietnamese",             "script": "Latn"}, #       | Sp, Tx | Sp, Tx |
    "xho": {"label": "Xhosa",                  "script": "Latn"}, #       | Sp     | \--    |
    "yor": {"label": "Yoruba",                 "script": "Latn"}, #       | Sp, Tx | Tx     |
    "yue": {"label": "Cantonese",              "script": "Hant"}, #       | Sp, Tx | Tx     |
    "zlm": {"label": "Colloquial Malay",       "script": "Latn"}, #       | Sp     | \--    |
    "zsm": {"label": "Standard Malay",         "script": "Latn"}, #       | Tx     | Tx     |
    "zul": {"label": "Zulu",                   "script": "Latn"}, #       | Sp, Tx | Tx     |
}

language_aliases = {
    "en" : "eng",
    "zh" : "cmn",
}

def transcribe(request: TranscriptionRequest) -> TranscriptionResponse:
    # From https://huggingface.co/facebook/seamless-m4t-large

    # Initialize a Translator object with a multitask model, vocoder on the GPU.
    # translator = Translator("seamlessM4T_large", vocoder_name_or_card="vocoder_36langs", device=torch.device("cuda:0"))

    if request.audio:
        n_samples = len(request.audio.waveform)
        sample_rate = request.audio.sample_rate
        waveform = torch.cuda.FloatTensor([request.audio.waveform]).reshape(n_samples, 1)
        duration = n_samples / sample_rate
        translated_text, *_ = model.predict(
            waveform,
            "S2TT",
            request.target_language or "eng",
            sample_rate=float(sample_rate),
        )
    elif request.text:
        src_lang = request.source_language or None
        if src_lang not in supported:
            src_lang = language_aliases[src_lang]

        translated_text, *_ = model.predict(
            request.text,
            "T2TT",
            request.target_language or "eng",
            src_lang=src_lang,
        )
        duration = None


    return TranscriptionResponse(
        source_language=request.source_language,
        source_language_prob=None,
        target_language=request.target_language,
        duration=duration,
        segments=[
            TranscriptionSegment(
                # id=segment.id,
                # seek=segment.seek,
                start=0.0,
                end=duration,
                text=str(translated_text),
                # temperature=segment.temperature,
                # avg_logprob=segment.avg_logprob,
                # compression_ratio=segment.compression_ratio,
                # no_speech_prob=segment.no_speech_prob,
                # words=[
                #     Word(
                #         start=word.start,
                #         end=word.end,
                #         word=word.word,
                #         prob=word.probability,
                #     )
                #     for word in segment.words
                # ] if segment.words else None,
            )
        ],
    )

app = new_v1_api_app(transcribe=transcribe)
