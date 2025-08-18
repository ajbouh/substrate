/**
 * Creates a dynamic module environment from source code strings.
 *
 * @returns {{
 * entryURL: string;
 * importMap: { imports: Record<string, string>, scopes: Record<string, Record<string, string>> };
 * cleanup: () => void;
 * }} An object containing the entry point blob URL, the generated import map,
 * and a function to revoke all created blob URLs.
 */
export function createDynamicModule({entryName, entrySource, importSources={}, scopedImports={}, scopes={}}) {
  const blobURLs = new Set();

  // Helper to create a blob URL from source code
  const createBlobURL = (source) => {
    const blob = new Blob([source], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    blobURLs.add(url);
    return url;
  };

  // Create blob URLs for all sources
  const importURLs = Object.fromEntries(
    Object.entries(importSources).map(([specifier, source]) => [
      specifier,
      createBlobURL(source),
    ])
  );

  const importMap = {
    scopes: {
      ...scopes,
    },
  };

  let entryURL
  if (entrySource) {
    entryURL = createBlobURL(entrySource);

    importMap.scopes[entryURL] = {
      ...importURLs,
      ...scopedImports,
    }

    if (entryName) {
      importMap.imports = {
        [entryName]: entryURL,
      }
    }
  }

  // Define the cleanup function
  const cleanup = () => {
    for (const url of blobURLs) {
      URL.revokeObjectURL(url);
    }
    blobURLs.clear();
  };

  return { entryURL, importMap, cleanup };
}
