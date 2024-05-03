import express from 'express';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { processDir } from "./process-dir.js"
import { Tree } from "./Tree.tsx"

export const port = +(process.env.PORT || '3000')

const main = ({
  rootPath = "",
  maxDepth = 9,
  customFileColors = {},
  colorEncoding = 'type',
  excludedPaths = ["node_modules","bower_components","dist","out","build","eject",".next",".netlify",".yarn",".git",".vscode","package-lock.json","yarn.lock"],
  excludedGlobs = [],
}={}) => {
  const data = processDir(rootPath, excludedPaths, excludedGlobs);

  return ReactDOMServer.renderToStaticMarkup(
    <Tree data={data} maxDepth={+maxDepth} colorEncoding={colorEncoding} customFileColors={customFileColors}/>
  );
}

const app = express()

const idleTimeoutMillis = 3000
let timeout
function resetIdleTimeout() {
  if (timeout) {
    clearTimeout(timeout)
  }
  timeout = setTimeout(() => {
    console.log(`no requests for ${idleTimeoutMillis}ms, exiting`)
    process.exit()
  }, idleTimeoutMillis)
}

app.get('/', (req, res) => {
  // reset when the request arrives
  resetIdleTimeout()
  res.set('Content-Type', 'image/svg+xml')
  res.send(main({
    rootPath: "spaces/data/tree",
  }))

  // and again after it's complete
  resetIdleTimeout()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
