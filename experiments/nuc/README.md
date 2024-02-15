# Setting up Intel NUC for Substrate OS

## Setting up hardware

Follow this video from Intel: https://www.youtube.com/watch?v=xDIaPWgUiqI
The SSD slot shown in the video is slot #3 (out of #1-#3).

The 8-pin cable for the card needs to be connected, but not before you open the BIOS by hitting F2 while the unit powers up.

Go to the "Boot" section of the BIOS menu, and "disable" the Secure Boot flag. This presumably allow the driver to access the video card.

Go to "Advanced" setion of the BIOS menu, choose "Video" and then change "Primary Display" to IGFX so that the system won't bother using GPU card as display.

Then, connect the 8-pin cable.

## Installing OS

Download the ISO file from: https://drive.google.com/drive/folders/1D_046vPN9cbfVP6orFfcblz4DeeT-aXc

Burn it to a USB memory. On Mac use `dd`:

(make sure that your `of` device is the correct device)

    # sudo dd if=substrateos-39.20240124.dev.2-live.x86_64.iso of=/dev/rdisk5 status=progress bs=4k

on Linux, it'd typically be:

    # sudo dd if=substrateos-39.20240124.dev.2-live.x86_64.iso of=/dev/sda status=progress

again make sure that the `of` is your USB memory.

Plug the network cable (either port should work), USB keyboard and the OS USB image and power on.

You should see a command prompt if it properly booted from the USB. if not, turn off and on the computer, and hitting F10 on keyboard to get the BIOS boot menu.

Run

    # `sudo coreos-installer install /dev/nvme0n1`

Just make sure that the destination disk should be the correct one (this will reformat the disk without confirmation).

Type nvidia-smi to see if the command can find the GPU card.

When the `coreos-installer` command finishes, run `sudo shutdown -h now`, and when it goes down pull the USB memory and power on again.

---
On a remote computer you use to access to NUC, set up the domain name in /etc/hosts or its equivalent:

```
192.168.1.193 substrate.home.arpa
```

You should also add an entry for it to your ~/.ssh/config.

```
Host substrate.home.arpa
    User core
    IdentityFile ~/.ssh/id_substrate
```

where `id_substrate` is a key pair you create with ssh-keygen.

You can access the shell of the NUC box from the browser:

`https://substrate:substrate@substrate.home.arpa/debug/shell`

(which assmes that substrate.home.arpa is a host name your machine recognizes.)

In the shell in the browser run:

```
su core
cd
mkdir -p ~/.ssh/authorized_keys.d
cat > ~/.ssh/authorized_keys.d/dev <<EOF
ssh-ed25519 AAAA....rdnv74u4Sa14mi+ ohshima@Asshimar.local
EOF
```

where `AAAA... is a string of the public key generated for `id_substrate`.

- Now  you can run `ssh into substrate.home.arpa` from your computer to access Substrate OS.

## Running Bridge

- First Update Substrate OS on the NUC by running:

    # ./remote ./dev.sh reload

on your computer. This may take a long time (like half an hour).

Once it is done, access `https://substrate.home.arpa/bridge/` from your browser running on your computer. You need to click on the "unsecure but access anyway" link to acknowledge that this is using aself-signed certificate. If you press the "Unmute" button it should start listening audio from the microphone and transcribe it.
