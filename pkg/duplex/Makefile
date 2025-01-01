.PHONY: npm

build: dist/duplex.js  dist/duplex.min.js

npm:
	deno run -A scripts/build_npm.ts 0.1.0

clobber:
	rm -rf ./dist

dist/duplex.js: **.ts
	mkdir -p dist
	esbuild index_browser.ts --bundle --format=esm --outfile=./dist/duplex.js 

dist/duplex.min.js: **.ts
	esbuild index_browser.ts --bundle --format=esm --outfile=./dist/duplex.min.js --minify