package defs

import (
  "regexp"
)



resourcedirs: [id=(string & =~"^huggingface:[^:]+:[^:]+:[^:]+(:[^:]+)?$")]: {
  let m = regexp.FindSubmatch("^huggingface:([^:]+):([^:]+):([^:]+)(?::([^:]+))?$", id)
  let type = m[1]
  let repo = m[2]
  let revision = m[3]
  let file = m[4]

  sha256: _
  #imagespec: {
    image: "\(#var.image_prefix)resourcedir-huggingface-\(sha256)"
    build: dockerfile: "images/huggingface-cli/Dockerfile"
    build: args: {
      TYPE: type
      REPO: repo
      REVISION: revision
      if file != "" {
        FILE: file
      }
    }
  }
}

// https://huggingface.co/docs/huggingface_hub/guides/download

// usage: huggingface-cli <command> [<args>] download [-h]
//                                                   [--repo-type {model,dataset,space}]
//                                                   [--revision REVISION]
//                                                   [--include [INCLUDE [INCLUDE ...]]]
//                                                   [--exclude [EXCLUDE [EXCLUDE ...]]]
//                                                   [--cache-dir CACHE_DIR]
//                                                   [--local-dir LOCAL_DIR]
//                                                   [--local-dir-use-symlinks {auto,True,False}]
//                                                   [--force-download]
//                                                   [--resume-download]
//                                                   [--token TOKEN] [--quiet]
//                                                   repo_id
//                                                   [filenames [filenames ...]]

// positional arguments:
//   repo_id               ID of the repo to download from (e.g. `username/repo-
//                         name`).
//   filenames             Files to download (e.g. `config.json`,
//                         `data/metadata.jsonl`).

// optional arguments:
//   -h, --help            show this help message and exit
//   --repo-type {model,dataset,space}
//                         Type of repo to download from (e.g. `dataset`).
//   --revision REVISION   An optional Git revision id which can be a branch
//                         name, a tag, or a commit hash.
//   --include [INCLUDE [INCLUDE ...]]
//                         Glob patterns to match files to download.
//   --exclude [EXCLUDE [EXCLUDE ...]]
//                         Glob patterns to exclude from files to download.
//   --cache-dir CACHE_DIR
//                         Path to the directory where to save the downloaded
//                         files.
//   --local-dir LOCAL_DIR
//                         If set, the downloaded file will be placed under this
//                         directory either as a symlink (default) or a regular
//                         file. Check out https://huggingface.co/docs/huggingfac
//                         e_hub/guides/download#download-files-to-local-folder
//                         for more details.
//   --local-dir-use-symlinks {auto,True,False}
//                         To be used with `local_dir`. If set to 'auto', the
//                         cache directory will be used and the file will be
//                         either duplicated or symlinked to the local directory
//                         depending on its size. It set to `True`, a symlink
//                         will be created, no matter the file size. If set to
//                         `False`, the file will either be duplicated from cache
//                         (if already exists) or downloaded from the Hub and not
//                         cached.
//   --force-download      If True, the files will be downloaded even if they are
//                         already cached.
//   --resume-download     If True, resume a previously interrupted download.
//   --token TOKEN         A User Access Token generated from
//                         https://huggingface.co/settings/tokens
//   --quiet               If True, progress bars are disabled and only the path
//                         to the download files is printed.
