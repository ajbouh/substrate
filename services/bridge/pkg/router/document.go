package router

type Document struct {
	Transcriptions []*Transcription `json:"transcriptions"`
	StartedAt      int64            `json:"startedAt"`
}

type Participant struct {
	Label       string `json:"label"`
	IsAssistant bool   `json:"isAssistent"`
}

type Status struct {
	Participants *[]Participant
}

func (d *Document) Clone() *Document {
	return &Document{
		StartedAt:      d.StartedAt,
		Transcriptions: append([]*Transcription{}, d.Transcriptions...),
	}
}

func (d *Document) CloneFinal() *Document {
	transcriptions := make([]*Transcription, 0, len(d.Transcriptions))
	for _, t := range d.Transcriptions {
		if t.Final {
			transcriptions = append(transcriptions, t)
		}
	}

	return &Document{
		StartedAt:      d.StartedAt,
		Transcriptions: transcriptions,
	}
}

func (d *Document) Update(transcription *Transcription) {
	// TODO should insert in sorted order...
	used := false
	for i, ex := range d.Transcriptions {
		if ex.ID == transcription.ID {
			d.Transcriptions[i] = transcription
			used = true
			break
		}
	}
	if !used {
		d.Transcriptions = append(d.Transcriptions, transcription)
		used = true
	}
}
