import fs from "fs";
import * as nodePath from 'path';
import { shouldExcludePath } from './should-exclude-path';


export const processDir = (rootPath = "", excludedPaths = [], excludedGlobs = []) => {
  const foldersToIgnore = [".git", ...excludedPaths]
  const fullPathFoldersToIgnore = new Set(foldersToIgnore.map((d) =>
    nodePath.join(rootPath, d)
  ));


  const getFileStats = (path = "") => {
    const stats = fs.statSync(`./${path}`);
    const name = path.split("/").filter(Boolean).slice(-1)[0];
    const size = stats.size;
    const relativePath = path.slice(rootPath.length + 1);
    return {
      name,
      path: relativePath,
      size,
    };
  };
  const addItemToTree = (
    path = "",
    isFolder = true,
  ) => {
    try {
      console.log("Looking in ", `./${path}`);

      if (isFolder) {
        const filesOrFolders = fs.readdirSync(`./${path}`);
        const children = [];

        for (const fileOrFolder of filesOrFolders) {
          const fullPath = nodePath.join(path, fileOrFolder);
          if (shouldExcludePath(fullPath, fullPathFoldersToIgnore, excludedGlobs)) {
            continue;
          }

          const info = fs.statSync(`./${fullPath}`);
          const stats = addItemToTree(
            fullPath,
            info.isDirectory(),
          );
          if (stats) children.push(stats);
        }

        const stats = getFileStats(path);
        return { ...stats, children };
      }

      if (shouldExcludePath(path, fullPathFoldersToIgnore, excludedGlobs)) {
        return null;
      }
      const stats = getFileStats(path);
      return stats;

    } catch (e) {
      console.log("Issue trying to read file", path, e);
      return null;
    }
  };

  const tree = addItemToTree(rootPath);

  return tree;
};
