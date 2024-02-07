
export var Sidebar = {
  view: ({attrs}) => {
    const sessions = attrs.sessions || [];
    return m("div", {"class":"w-64 h-screen border-r-2 border-gray-800"},
      [
        m("div", {"class":"flex flex-wrap px-6 py-4"},
          [
            m("h1", {"class":"py-1 text-xl font-bold grow"}, 
              "bridge"
            ),
            m("a", {"class":"py-2","href":"./sessions"}, 
              m("svg", {"class":"feather feather-plus-square","xmlns":"http://www.w3.org/2000/svg","width":"24","height":"24","viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},
                [
                  m("rect", {"x":"3","y":"3","width":"18","height":"18","rx":"2","ry":"2"}),
                  m("line", {"x1":"12","y1":"8","x2":"12","y2":"16"}),
                  m("line", {"x1":"8","y1":"12","x2":"16","y2":"12"})
                ]
              )
            )
          ]
        ),
        ...sessions.map(s => m("div", {"class":"px-6 py-2"}, 
          m("a", {"href":`./sessions/${s}`}, 
            s
          )
        )) 
      ]
    )
  }
}