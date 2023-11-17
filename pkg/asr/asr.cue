package asr

#Word: {
    start: float
    end: float
    word: string
    prob: float
}

#Segment: {
    id ?: int
    seek ?: int
    start ?: float
    end ?: float

    // speaker ?: string

    text ?: string
    // tokens: [...int]
    temperature ?: float
    avg_logprob ?: float
    compression_ratio ?: float
    no_speech_prob ?: float
    words ?: [...#Word]

    // audio_data ?: #Audio
}

#Response: {
    source_language ?: string
    source_language_prob ?: float
    target_language ?: string
    duration ?: float
    all_language_probs ?: [string]: float

    segments ?: _ // [...#Segment]
}

#Request: {
    audio_data ?: bytes | string
    task: string

    source_language ?: string
    target_language ?: string
    text ?: string
    segments ?: _ // [...#Segment]
}

// #DiarizationSegment: {
//     start: float
//     end: float
//     track: int
//     label: string
// }

// #DiarizationRequest: {
//     audio_data ?: #Audio
//     task: string
//     segments ?: #DiarizationSegment
// }

// #DiarizationResponse: {
//     segments: [...#DiarizationSegment]
// }

// #ASROptions: {
//     beam_size: int
//     best_of: int
//     patience: float
//     length_penalty: float
//     repetition_penalty: float
//     log_prob_threshold ?: float
//     no_speech_threshold ?: float
//     compression_ratio_threshold ?: float
//     condition_on_previous_text: bool
//     prompt_reset_on_temperature: float
//     temperatures: [...float]
//     initial_prompt ?: Union[string, Iterable[int]]
//     prefix ?: string
//     suppress_blank: bool
//     suppress_tokens ?: [...int]
//     without_timestamps: bool
//     max_initial_timestamp: float
//     word_timestamps: bool
//     prepend_punctuations: string
//     append_punctuations: string
// }