package lens

import (
  "github.com/ajbouh/substrate/pkg:svg"
)

name: "substrate"

#build: null

activities: {
  // attach: {
  //   request: {
  //     path: "/api/v1/collections/:owner/:name/lensspecs/:lensspec"
  //     method: "POST"
  //     schema: {
  //       owner: {
  //         type: "owner"
  //       }
  //       name: {
  //         type: "?"
  //       }
  //       lensspec: {
  //         type: "?"
  //       }
  //     }
  //   }
  // }
  new: {
    activity: "user:new-space"
    image: (svg.#SVGImageData & {
      #src: """
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
        <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
      </svg>
      """
    }).#out

    label: "Create new space"
    request: {
      path: "/api/v1/spaces"
      method: "POST"
    }
    response: {
      schema: {
        space: type: "space"
      }
    }
  }
  fork: {
    activity: "user:new-space"
    image: (svg.#SVGImageData & {
      // Heroicon name: mini/document-duplicate
      #src: """
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
          <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
        </svg>
      """
    }).#out

    label: "fork space"
    request: {
      path: "/api/v1/spaces"
      method: "POST"
      schema: {
        space_base_ref: {
          type: "space"
          body: ["space_base_ref"]
        }
      }
    }
    response: {
      schema: {
        space: type: "space"
      }
    }
  }
}
