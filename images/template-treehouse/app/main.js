import {setup} from "../lib/treehouse.min.js";
import {SubstrateBackend} from "./backend.js"

setup(document, document.body, new SubstrateBackend("/events;data=sp-01HYGRYYDM5BMFEY80PJM2P570"));

setTimeout(() => {
  if (!localStorage.getItem("firsttime")) {
    window.workbench.showNotice('firsttime');
  }
}, 2000)

