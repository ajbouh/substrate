# Substrate

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

6. Back on your development machine you should add the NUC's IP address to your `/etc/hosts` file and `~/.ssh/config`.
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

8. Now on your development machine you can check out the future branch

    ```shell
    git checkout future
    ```

9. Build the container images, resourcedirs, and systemd units on the remote machine:

    ```
    # HACK this is a workaround because we aren't properly mounting the oob files
    ./remote ssh sudo mkdir -p /run/media/oob/imagestore
    # HACK we can't yet populate resourcedirs at "runtime". populate them as a side effect of building the oob (out-of-band) squashfs
    ./remote ./dev.sh oob-make
    ./remote ./dev.sh reload
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


10. On your laptop, visit https://substrate.home.arpa/gw/bridge/. Select your microphone, click "Unmute", and try speaking.

11. After the initial reload, you can limit your build to a specific image. For example:

    ```
    ./remote ./dev.sh reload bridge
    ```
