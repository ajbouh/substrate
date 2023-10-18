export interface TranscriptWord {
  start: number
  end: number
  word: string
  prob: number
}

export interface TranscriptSegment {
  id: string
  seek: number // 10ms frame
  start: number
  end: number
  temperature: number
  avg_logprob: number
  compression_ratio: number
  no_speech_prob: number

  speaker: string
  is_assistant?: boolean

  text?: string
  words: TranscriptWord[]
}

export interface Transcript {
  language: string
  language_prob: number
  id: string
  final: boolean
  audio: {
    start: number
    end: number
  }[]
  start: number
  end: number
  duration: number
  segments: TranscriptSegment[]
}

export interface TranscriptDocument {
  transcriptions: Transcript[]
	transcribedText: string
	currentTranscription: string
	newText: string
  startedAt: number
}

export interface RenderedTranscriptSession {
  participants: string[]
  related: string
  statistics: string
  summary: string
  headline: string
  date: Date
  entries: RenderedTranscriptEntry[]
}

export type RenderedTranscriptWord = TranscriptWord

export interface RenderedTranscriptEntry {
  time: Date
  isAssistant: boolean
  language: string
  precedingSilence: number
  sessionTime: number
  speakerLabel: string
  final: boolean
  text: string
  words: RenderedTranscriptWord[]
  debug: {
    precedingSilence: number
    sessionTimeMs: number
    sessionTime: number
    transcriptEndTimestamp: number
    transcriptStartTimestamp: number
    transcript: Transcript
    segment: TranscriptSegment
  }[]
}

export function renderableTranscriptSession(transcriptions: Transcript[]): RenderedTranscriptSession {
  const participants = new Set<string>()
  const session: RenderedTranscriptSession = {
    get participants() {
      return Array.from(participants)
    },
    related: '',
    statistics: '',
    summary: '',
    headline: '',
    date: new Date(),
    entries: [],
  }

  if (!transcriptions) {
    return session
  }

  // const startedAtMs = doc.startedAt * 1000
  const startedAtMs = +new Date()
  session.date = new Date(startedAtMs)

  let lastSegmentSessionEndTimeS
  let lastEntry: RenderedTranscriptEntry | undefined
  for (const transcript of transcriptions) {
    const transcriptEndTimestampS = transcript.end / 1000
    const transcriptStartTimestampMs = transcript.start
    const transcriptStartTimestampS = transcriptStartTimestampMs / 1000
    for (const segment of transcript.segments) {
      const sessionTimeMs = (segment.start * 1000) + transcriptStartTimestampMs
      const sessionTimeS = Math.floor(sessionTimeMs / 1000)
      const precedingSilence = lastSegmentSessionEndTimeS == null ? sessionTimeS : sessionTimeS - lastSegmentSessionEndTimeS

      if (lastEntry &&
          lastEntry.speakerLabel === segment.speaker &&
          lastEntry.isAssistant === segment.is_assistant &&
          lastEntry.language === transcript.language &&
          lastEntry.final === transcript.final &&
          (lastEntry.words == null) === (segment.words == null) &&
          precedingSilence < 1) {
        lastEntry.text += segment.text || ''
        if (lastEntry.words) {
          lastEntry.words = lastEntry.words.concat(segment.words)
        }
        lastEntry.debug.push({ precedingSilence, transcript, sessionTimeMs, sessionTime: sessionTimeS, transcriptEndTimestamp: transcriptEndTimestampS, transcriptStartTimestamp: transcriptStartTimestampS, segment })
      } else {
        participants.add(segment.speaker)
        lastEntry = {
          speakerLabel: segment.speaker,
          final: transcript.final,
          isAssistant: segment.is_assistant || false,
          language: transcript.language,
          precedingSilence,
          sessionTime: sessionTimeS,
          time: new Date(startedAtMs + sessionTimeMs),
          text: segment.text || '',
          words: segment.words,
          debug: [{ precedingSilence, transcript, sessionTimeMs, sessionTime: sessionTimeS, transcriptEndTimestamp: transcriptEndTimestampS, transcriptStartTimestamp: transcriptStartTimestampS, segment}]
        }
        session.entries.push(lastEntry)
      }
      lastSegmentSessionEndTimeS = transcriptStartTimestampS + segment.end 
    }
    lastSegmentSessionEndTimeS = transcriptEndTimestampS
  }

  return session
}