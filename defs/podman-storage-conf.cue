package defs

// This file is the configuration file for all tools
// that use the containers/storage library. The storage.conf file
// overrides all other storage.conf files. Container engines using the
// container/storage library do not inherit fields from other storage.conf
// files.
//
//  Note: The storage.conf file overrides other storage.conf files based on this precedence:
//      /usr/containers/storage.conf
//      /etc/containers/storage.conf
//      $HOME/.config/containers/storage.conf
//      $XDG_CONFIG_HOME/containers/storage.conf (If XDG_CONFIG_HOME is set)
// See man 5 containers-storage.conf for more information
// The "container storage" table contains all of the server options.
podman_storage_conf: storage: {
    // Default Storage Driver, Must be set for proper operation.
    driver: "overlay"

    // Temporary storage location
    runroot: "/run/containers/storage"

    // Primary Read/Write location of container storage
    // When changing the graphroot location on an SELINUX system, you must
    // ensure  the labeling matches the default locations labels with the
    // following commands:
    // semanage fcontext -a -e /var/lib/containers/storage /NEWSTORAGEPATH
    // restorecon -R -v /NEWSTORAGEPATH
    graphroot: "/var/lib/containers/storage"

    options: {
        // AdditionalImageStores is used to pass paths to additional Read/Only image stores
        // Must be comma separated list.
        additionalimagestores: [...string]

        // Allows specification of how storage is populated when pulling images. This
        // option can speed the pulling process of images compressed with format
        // zstd:chunked. Containers/storage looks for files within images that are being
        // pulled from a container registry that were previously pulled to the host.  It
        // can copy or create a hard link to the existing file when it finds them,
        // eliminating the need to pull them from the container registry. These options
        // can deduplicate pulling of content, disk storage of content and can allow the
        // kernel to use less memory when running containers.

        // containers/storage supports three keys
        //   * enable_partial_images="true" | "false"
        //     Tells containers/storage to look for files previously pulled in storage
        //     rather then always pulling them from the container registry.
        //   * use_hard_links = "false" | "true"
        //     Tells containers/storage to use hard links rather then create new files in
        //     the image, if an identical file already existed in storage.
        //   * ostree_repos = ""
        //     Tells containers/storage where an ostree repository exists that might have
        //     previously pulled content which can be used when attempting to avoid
        //     pulling content from the container registry
        pull_options: {enable_partial_images: "false", use_hard_links: "false", ostree_repos: ""}

        overlay: {
            // mountopt specifies comma separated list of extra mount options
            mountopt: "nodev,metacopy=on"
        }

        thinpool: {}
    }
}
