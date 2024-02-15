Setting up Intel NUC for Substrate OS

## Setting up hardware

Follow this video from Intel: https://www.youtube.com/watch?v=xDIaPWgUiqI
The SSD slot shown in the video is slot #3 (out of #1-#3).

The 8-pin cable for the card needs to be connected, but not before you open the BIOS by hitting F2 while the unit powers up.

- Go to the "Boot" section of the BIOS menu, and "disable" the Secure Boot flag. This presumably allow the driver to access the video card.
- Go to "Advanced" setion of the BIOS menu, choose "Video" and then change "Primary Display" to IGFX so that the system won't bother using GPU card as display.

Then, connect the 8-pin cable.

# Installing OS

Download the image from: https://drive.google.com/drive/folders/1D_046vPN9cbfVP6orFfcblz4DeeT-aXc

burn it to a USB memory. On Mac use `dd`:

(make sure that your `of` is the correct device)

dd if=substrateos-39.20240124.dev.2-live.x86_64.iso of=/dev/rdisk5 status=progress bs=4k

Plug the network cable (either port should work), USB keyboard and the OS USB image and power on.

- Login as user "core" (?)

- Run `coreos-installer install /dev/nvme0n1`

- From the USB memory, where the destination disk should be the correct one (this will reformat the disk without confirmation).

---
Type nvidia-smi to see if the command can find the GPU card.

On a remote computer you use to access to NUC, set up the domain name in /etc/hosts or its equivalent:

192.168.1.193 substrate.home.arpa

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
mkdir -p ~/.ssh/authorized_keys.d
cat > ~/.ssh/authorized_keys.d/dev <<EOF
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIF1h8jxaCJ5n7a8E6oHXL5ifqykytyKmzfIknM7b+0wL
EOF
```

where `AAAA... is a string of the public key generated for `id_substrate`.
