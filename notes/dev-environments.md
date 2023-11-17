we need a way to build operating system images. today, prereqs for that process are:
- linux with /dev/kvm and /dev/fuse
- podman
- 500GB disk space (enough to store disk image sources AND multiple copies of built disk image)
- portable hard drive OR fast internet connection (to make image availabe)

current plan:
- within the image:
  - run some kind of vs code from a daemon on the image
  - run some kind of tailscale daemon (need to be able to inject tailscale auth key)
- boot machine
  - (optionally ssh into machine and start tailscale daemon)
  - clone repo onto machine
  - run ./dev.sh os-make
  - (if we want to try it, run ostree rebase ... --reboot)
  - burn a new disk image
  - upload image
  - seems like we need two different machines...

developer use cases:
- rebuild SubstrateOS image from scratch
- iterate on a single lens
- iterate on blackboard expressions
- iterate on Substrate gateway
- iterate on real world hw/sw interplay
  - processing qr codes, voice commands, etc
  - using onboard microphone, speaker, camera, display
  - configuring network access

open questions:
- how do develop the appliance from within the appliance? can we host a nested version of the experience? run them concurrently?
- it feels a little confusing to be developing the OS from within the OS ...
  - what if you write a bad installer and reformat your source code partition?
  - how do you use the main OS vs your modified one? for example, which OS gets access to the onboard hardware?
  - what about the network ports? network ports don't nest well.
 
given the above, perhaps we should be able to bring up a fully virtualized version of the OS, even running on its own IP address... that would certainly simplify port mapping and improve nesting
no obvious solution to risking data loss at this time