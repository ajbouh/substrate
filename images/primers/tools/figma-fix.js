#!/usr/bin/env node

import path from 'path'
import fs from 'fs';
import svgo from 'svgo';

// TODO use ~85% quality
// import pngToWebp from 'someimageconverter'

const [,, outdir, ...files] = process.argv
for (const f of files) {
  const svgString = fs.readFileSync(f, 'utf-8');

  const {data} = svgo.optimize(svgString, {
    plugins: [
      {
        name: 'replaceInlinePng',
        fn: () => {
          return {
            element: {
              enter: (item) => {
                if (item.name === 'image' && item.attributes['xlink:href']) {
                  const pngData = item.attributes['xlink:href'];
                  if (pngData.startsWith('data:image/png;base64,')) {
                    const customFilePath = f.replace(/\.svg$/, '.webp');
                    console.log({customFilePath})
                    console.log({item})
                    if (fs.existsSync(customFilePath)) {
                      const data = fs.readFileSync(customFilePath, 'base64');
                      item.attributes['xlink:href'] = `data:image/webp;base64,${data}`;
                    }
                  }
                }
              }
            }
          }
        },
      },
    ],
  })
  
  fs.writeFileSync(path.join(outdir, path.basename(f)), data);
}
