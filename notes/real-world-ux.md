we need a context-free way to inject commands into the system.

why context free?
- on first start, we won't have any configuration
- we want to be able to iterate freely and requiring context for certain experiences to work

what are context free approaches?
- onboard microphone + speech recognition (+ speaker to acknowledge; ± LEDs)
- onboard display + touch screen

what are minimal context approaches?
- camera + qr codes
- appliance can create a wifi network and show a qr code for joining it, then:
  - show a qr code to load barcode ui (this can be a PWA)
  - show a qr code to load web app ui (this can't easily be a PWA)

what sort of commands might we care about?
- add authorized ssh key
- claim admin
- join tailnet
- configure network (join WiFi network, Ethernet, etc.)
- open webpage in chromestage on onboard display
- run shell command and show it on display
