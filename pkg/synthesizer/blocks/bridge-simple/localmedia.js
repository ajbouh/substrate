export class LocalMedia {
  constructor(opts) {
    let defaults = {
      onstreamchange: (stream) => null,
      ondevicechange: () => null,
      audioDevices: [],
      videoDevices: [],
      outputDevices: [],
      audioSource: undefined,
      videoSource: undefined,
      audioEnabled: true,
      videoEnabled: true,
      stream: undefined,
    };
    for (const [key, defaultValue] of Object.entries(defaults)) {
      if (opts.hasOwnProperty(key)) {
        this[key] = opts[key];
      } else {
        this[key] = defaultValue;
      }
    }
    if (navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener('devicechange', () => this.updateDevices());
    }
  }

  setup() {
      return Promise.all([this.updateStream(), this.updateDevices()]);
  }

  setAudioSource(deviceId) {
    this.audioSource = deviceId;
    return this.updateStream();
  }

  setVideoSource(deviceId) {
    this.videoSource = deviceId;
    return this.updateStream();
  }

  toggleAudio() {
    this.audioEnabled = !this.audioEnabled;
    return this.updateStream();
  }

  toggleVideo() {
    this.videoEnabled = !this.videoEnabled;
    return this.updateStream();
  }

  shareScreen() {
    return this.setVideoSource('screen');
  }

  updateStream() {
    let promise;
    if (navigator.mediaDevices) {
      if (this.videoSource === 'screen') {
        promise = navigator.mediaDevices.getDisplayMedia({
          audio: {deviceId: true},
          video: {deviceId: true},
          systemAudio: 'include',
        });
      } else {
        const source = (src) => {
          if (src === false) {
            return false;
          }
          return {deviceId: src ? {exact: src} : true};
        }
        promise = navigator.mediaDevices.getUserMedia({
          audio: source(this.audioSource),
          video: source(this.videoSource),
        });
      }
    } else {
      promise = Promise.resolve(false);
    }
    return promise.then((stream) => {
      if (!stream) {
        return null;
      }
      this.stream = stream;
      console.log(this.stream.getAudioTracks());
      if (!this.audioEnabled) {
        for (const track of this.stream.getAudioTracks()) {
          track.enabled = false;
        }
      }
      if (!this.videoEnabled) {
        for (const track of this.stream.getVideoTracks()) {
          track.enabled = false;
        }
      }
      if (this.onstreamchange) {
        this.onstreamchange(this.stream);
      }
      return this.stream;
    });
  }

  updateDevices() {
    if (!navigator.mediaDevices) {return Promise.resolve([]);}
    return navigator.mediaDevices.enumerateDevices().then((devices) => {
      this.audioDevices = devices.filter(({kind}) => kind === "audioinput");
      this.videoDevices = devices.filter(({kind}) => kind === "videoinput");
      this.outputDevices = devices.filter(({kind}) => kind === "audiooutput");
      if (this.ondevicechange) {
        this.ondevicechange();
      }
      return devices;
    });
  }
}
