// pdf-viewer

const modules = Behaviors.resolvePart({
    pdfjsLib: import("./blocks/pdfjs/pdf.min.mjs").then(pdf => (pdf.GlobalWorkerOptions.workerSrc = "./pdf.worker.min.mjs", pdf)),
});

Events.send(ready, true);

const records = Behaviors.collect([], recordsUpdated, (now, {incremental, records}) => incremental ? [...now, ...records] : records);

const recordDataURL = Behaviors.select(
    undefined,
    Events.change(records[0]), (now, record) => {
        if (record.data_url) {
            return record.data_url
        }
        return undefined
    },
);

const init = "init"

// Create a canvas element dynamically
const canvas = (() => {
    const canvas = document.createElement('canvas');
    // canvas.id = 'pdfCanvas';
    canvas.style.border = '1px solid black';
    canvas.style.maxWidth = 'calc(100vw - 2px)';
    canvas.style.maxHeight = 'calc(100vh - 2px)';
    canvas.style.visibility = 'hidden';
    document.body.appendChild(canvas);
    document.body.style.display = 'grid';
    document.body.style.height = '100vh';
    document.body.style.placeItems = 'center';
    return canvas
})(Events.once(init));


// Get the 2D rendering context
const ctx = canvas.getContext('2d');

const pdf = modules.pdfjsLib.getDocument(recordDataURL).promise;
const pageNumber = 1;
const scale = 1.5;

const page = pdf.getPage(pageNumber);
const viewport = page.getViewport({ scale: scale });

const render = ((canvas, viewport, page) => {
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  canvas.style.visibility = 'visible';

  page.render({
    canvasContext: ctx,
    viewport: viewport
  });

  return "rendered"
})(canvas, viewport, page);

console.log({render});
console.log({page});
console.log({canvas});
console.log({pdf});
console.log({viewport});
