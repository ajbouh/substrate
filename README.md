# Substrate

Substrate has a concept of an `entity`. You can think of an `entity` as a network accessible object that accepts incoming messages (which we call `commands`) and has references to other entities (which we call `links`). Entities are identified by their URLs.

Any URL that provides a well-formed response to an HTTP REFLECT request can act as an entity. An entity will reply to REFLECT request with a JSON object containing a description and its commands.

{
    "description": ...
    "commands: {
        ...
    }
}

Entity commands are flexible. They can have side effects in the real world or they can just return useful information.

At present there is only one command:
- "links:query", which returns all links

By default substrate provides a root entity at https://substrate.home.arpa/

For now the easiest way to see these commands is to open https://substrate.home.arpa/ in Chrome and use the JavaScript Console in DevTools to programmatically explore and run them.

Here's a bit of code you can use to do that.
```js
let {ReflectCommands} = await import("/tool-call/js/commands.js")
await (await new ReflectCommands("/").reflect())
```

You can see it has commands:
- for any stateless service available in the system.
- to create a space
- to delete a space
- to push a space to a docker or OCI registry
- to pull a space from a docker or OCI registry

To list the links available from the root entity use the `links:query` command.

```js
await (await new ReflectCommands("/").reflect())["links:query"].run()
```

This will return an object with a `links` field. Expanding it, you can see that the root entity has links to:
- all spaces present in the system.
- all running service instances

A space is a filesystem that can serve files to the browser and can be accessed by services instances that are started with that space as a parameter.

Each space has links to:
- its tree of files
- all service instances that have *ever* used it as a spawn parameter

A space's file tree links to:
- the files and folders in its top-level directory
- the space itself

and has commands to:
- write a file
- read a file

Each folder in a space links to:
- its child entries
- its parent folder
- its containing space

and has commands to:
- write a file
- read a file

Each file in a space links to:
- its parent folder
- its containing space

and has commands to:
- write data to the file
- read data from the file

A service instance can return whatever links it prefers. Services authors are encouraged to map their own data models onto links and entities.

## Getting started with SubstrateOS

There are a lot of rough edges here, but hopefully this is much better base for folks to start with.

1. Download the most recent ISO

2. Burn it to a USB drive

3. It should boot directly to a terminal. If not, you can open the UEFI shell and boot using that.

    #### If you have the Intel NUC 13 Extreme, here's a workaround for USB not detected at BIOS.
    - Press F2 to enter BIOS
    - Boot > Boot Priority > enable "Internal UEFI Shell"
    - Disable secure boot.
    - Save & reboot
    - Press F10 to enter boot menu
    - Check the list of devices for the USB drive. Enter the drive letter, then start the boot efi:
      ```
      Shell> fs0:
      fs0:> .\EFI\BOOT\bootx64.efi
      ```

4. Run the installer

    ```shell
    # THIS WILL REFORMAT THE COMPUTER WITHOUT CONFIRMATION
    sudo coreos-installer install /dev/nvme0n1 
    ```

5. Then you can reboot (and remove the USB drive).
    ```shell
    sudo reboot
    ```

6. Back on your development machine you should add the NUC's IP address to your `/etc/hosts` file and `~/.ssh/config`. Be sure to use the machine's actual IP address, which is not always going to be `192.168.1.193`.
    ```
    # /etc/hosts
    192.168.1.193 substrate.home.arpa
    ```

    ```
    # ~/.ssh/config
    Host substrate.home.arpa
        User core
        IdentityFile ~/.ssh/id_substrate
    ```

7. Then visit the root debug shell at: https://substrate:substrate@substrate.home.arpa/debug/shell.

    Set a password for the core user (we are no longer using the substrate user), and set your authorized_key with something like:

    ```shell
    passwd core
    # enter a new password
    su core
    mkdir -p ~/.ssh/authorized_keys.d
    cat > ~/.ssh/authorized_keys.d/dev <<EOF
    ssh-ed25519 ...
    EOF
    ```

8. Build the container images, resourcedirs, and systemd units on the remote machine:

    ```
    # HACK this is a workaround because we aren't properly mounting the oob files
    ./remote ssh sudo mkdir -p /run/media/oob/imagestore
    ./remote ./dev.sh systemd-reload
    ```

    <details>

    Under the hood, `./remote ...` will:

    1) Sync your current checkout directly into the `substrate.home.arpa` device. This includes any staged or unstaged changes in tracked files, but *not* ignored or untracked files.
    2) Run the rest of the command (in this case `./dev.sh systemd-reload`) on the NUC itself 

    Under the hood, `./dev.sh systemd-reload` will:

    1) Override any substrateos-specific systemd units to match your current checkout (but not all of them)
    2) Rebuild containers
    3) Run `systemd daemon-reload`
    4) Restart the substrate service

    </details>


9. On your laptop, visit https://substrate.home.arpa/bridge/. Select your microphone, click "Unmute", and try speaking.

10. After the initial reload, you can limit your build to a specific image. For example:

    ```
    ./remote ./dev.sh systemd-reload bridge
    ```
