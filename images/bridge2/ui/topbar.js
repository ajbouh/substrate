export var Topbar = {
  view: ({attrs}) => {
    const localMedia = attrs.localMedia;
    return m("div", {"class":"flex flex-wrap px-6 py-4","id":"topbar"},
      [
        m("h1", {"class":"py-1 text-xl font-bold"},
          "session1"
        ),
        m("div", {"class":"grow"},
          m.trust("&nbsp;")
        ),
        m("div", {"class":"flex space-x-2","id":"mic-controls"}, [

          m("select", {name:"mic", id: "mic",
            class: "py-2 px-3 pr-9 border border-gray-600 rounded-md text-md focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-gray-400",
            onchange: (e) => localMedia.setAudioSource(e.target.value),
            disabled: false
          },
            localMedia.audioDevices.map(device => {
              return m("option", {value: device.deviceId}, device.label)
            })
          ),

          m("button", {name:"mic-mute", id:"mic-mute",
            class:"p-2 border border-gray-600 rounded-md text-md focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-gray-400",
            disabled: false,
            onclick: () => localMedia.toggleAudio()
          },
            localMedia.audioEnabled ? "Mute" : "Unmute"
          ),

          m("button", {
            class:"p-2 border border-gray-600 rounded-md text-md focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-gray-400",
            disabled: false,
            onclick: () => localMedia.shareScreen()
          },
            "Send System Audio"
          )

        ])
      ]
    )
  }
}
