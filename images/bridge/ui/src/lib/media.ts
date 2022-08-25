import { readable } from 'svelte/store'

export async function getMedia(mediaDevices: MediaDevices) {
  let audio;

  try {
    const audioStream = await mediaDevices.getUserMedia({
      audio: {
        // noiseSuppression: true
      },
    });
    audio = audioStream.getAudioTracks()[0];
    audio.enabled = false
  } catch (err: any) {
    console.error("error getting audio", err.message);
    throw new Error("audio is required to use bridge");
  }

  return new MediaStream([audio]);
}

export async function getMic(mediaDevices: MediaDevices, deviceId: string) {
  return await mediaDevices.getUserMedia({
    video: false,
    audio: {
      deviceId: deviceId ? { exact: deviceId } : undefined,
      // noiseSuppression: true,
    },
  });
}

export function audioInputDeviceStore(mediaDevices: MediaDevices) {
  mediaDevices.getUserMedia({ audio: true }).catch(() => { })

  return readable([], function start(set) {
    const update = (ev?: Event) => {
      console.log("update")
      mediaDevices.enumerateDevices().then(audioDevices => {
        audioDevices = audioDevices.filter(({kind}) => kind === 'audioinput')
        set(audioDevices)
      })
    }

    update()
    mediaDevices.addEventListener('devicechange', update)

    return () => {
      mediaDevices.removeEventListener('devicechange', update)
    }
  })
}
