package defs

enable: "jupyverse": true

imagespecs: "jupyverse": {}

"lenses": "jupyverse": {
  spawn: parameters: data: type: "space"

  space: {
    preview: "index.ipynb"
  }

  activities: {
    open: {
      activity: "user:open"
      priority: 10

      request: {
        interactive: true
        path: "/retro/notebooks/:path"
        schema: file: {
          type: "file"
          path: ":path"
          default: "index.ipynb"
        }
      }

      label: "open notebook with Jupyverse"
      // image: (svg.#SVGImageData & {
      //   // Heroicon name: mini/play
      //   #src: """
      //   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      //     <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
      //   </svg>
      //   """
      // }).#out
    }
  }
}
