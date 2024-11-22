import {reflect} from "/tool-call/js/commands.js"
import {setup} from "../lib/treehouse.min.js";
import {SubstrateBackend} from "./backend.js"


console.log({'document.baseURI': document.baseURI})

async function go() {
  const baseMsgs = await reflect(document.baseURI)
  const {links: baseLinks} = await baseMsgs['links:query'].run()
  const spaceMsgs = await reflect(baseLinks['space'].href)
  const {links: spaceLinks} = await spaceMsgs['links:query'].run()
  const eventstore = spaceLinks['eventstore'].href
  setup(document, document.body, new SubstrateBackend(eventstore));
}

go()

setTimeout(() => {
  if (!localStorage.getItem("firsttime")) {
    window.workbench.showNotice('firsttime');
  }
}, 2000)

