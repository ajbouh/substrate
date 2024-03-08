export var Session = {
  view: ({attrs}) => {
    return m("div", {"class":"session"},
      m("div", {"class":"mb-4"},
        [
          m("div", {"class":"date"}, attrs.date),
          // m("div", {"class":"summary"}, attrs.summary),
          m("div", {"class":"participants"},
            `Participants: ${(attrs.participants||[]).join(', ')}`
          ),
        ]
      ),
      m("div", {"class":"entries", "id": "entries"},
        (attrs.entries||[]).map(entry => m(Entry, entry))
      )
    )
  }
}

export var Entry = {
  view: ({attrs}) => {
    return m("div", {"class":"entry"}, [
      m("div", {"class":"left"},
        m("div", {"class":"time"}, formatTime(attrs.start)),
        // m("div", {"class":"session-time"}, formatSessionTime(attrs.sessionTime))
      ),
      m("div", {"class":"line","style":{"background-color":attrs.lineColor}},
        m("div", {"class":`right ${attrs.isAssistant ? "assistant": ""}`},
          // m("div", {"class":"name"}, attrs.speakerLabel),
          m("div", {"class": `text ${!attrs.final ? "text-gray-400": ""}`, lang: attrs.lang},
            attrs.text,
          ),
          attrs.translations.map(translation =>
            m("div", {"class": "text text-cyan-500", lang: translation.lang},
              translation.text,
            )
          ),
        )
      )
    ])
  }
}

const timeFmt = new Intl.DateTimeFormat("en-us", {timeStyle: "medium"});

function formatDuration(seconds) {
  if (seconds > 59 * 60) {
    return `${Math.round(seconds / 3600)} hour${seconds > (3600 * 1.5) ? 's': ''}`
  }

  if (seconds > 45) {
    return `${Math.round(seconds / 60)} minute${seconds > 90 ? 's': ''}`
  }

  return `${Math.round(seconds)} seconds`
}

function formatTime(time) {
  return timeFmt.format(time)
}

function formatSessionTime(seconds) {
  let hours = Math.floor(seconds / 3600)
  seconds -= hours * 3600
  let minutes = Math.floor(seconds / 60)
  seconds -= minutes * 60
  return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}
