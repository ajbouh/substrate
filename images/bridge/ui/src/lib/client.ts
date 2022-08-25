import type { Writable, Readable } from 'svelte/store'
import { writable, readonly } from 'svelte/store'
import { Transcript } from './transcript';

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function decodeDatachannelMessage(data) {
  const decoder = new TextDecoder();
  const arr = new Uint8Array(data);
  const json = JSON.parse(decoder.decode(arr));
  console.log("Got transcript:", json);
  return json
}

interface BridgeEvent0<T extends string, D=unknown> {
  type: T
  detail: D
}

interface Status {
  
}

export type TranscriptionEvent = BridgeEvent0<'transcription', Transcript[]>
export type StatusEvent = BridgeEvent0<'status', Status>

export type BridgeEvent = TranscriptionEvent | StatusEvent
export type BridgeEventHandler<T extends BridgeEvent=BridgeEvent> = (event: T) => void


export class Client {
  micEnabled: Readable<boolean>
  micEnabledWr: Writable<boolean>

  onEvent: BridgeEventHandler

  noPub: boolean
  noSub: boolean
  room: string
  stream: MediaStream
  pub: RTCPeerConnection | undefined
  pubAns: boolean | undefined
  pubCandidates: RTCIceCandidate[]
  sub: RTCPeerConnection | undefined
  subCandidates: RTCIceCandidate[]
  subOff: boolean | undefined
  url: string
  socket: WebSocket | undefined

  constructor(stream: MediaStream, noPub: boolean, noSub: boolean, room: string, url: string, onEvent: BridgeEventHandler) {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    this.stream = stream;
    this.noPub = noPub;
    this.noSub = noSub;
    this.room = room;
    this.url = url
    this.onEvent = onEvent

    const mic = this.stream.getAudioTracks()[0]

    this.micEnabledWr = writable(mic?.enabled)
    this.micEnabled = readonly(this.micEnabledWr)

    this.pubCandidates = [];
    if (!noPub) {
      this.pub = new RTCPeerConnection(configuration);
      this.pubAns = false;
      this.pub.onicecandidate = (e) => {
        const { candidate } = e;
        if (candidate) {
          console.log("[pub] ice candidate", JSON.stringify(candidate));
          if (this.pubAns) {
            this.trickle(candidate, 0);
          } else {
            this.pubCandidates.push(candidate);
          }
        }
      };

      this.pub.onconnectionstatechange = (e) => {
        const { connectionState } = this.pub!;
        console.log("[pub] connstatechange", connectionState);
      };
    }

    this.subCandidates = [];
    if (!noSub) {
      this.sub = new RTCPeerConnection(configuration);
      this.subOff = false;
      this.sub.onicecandidate = (e) => {
        const { candidate } = e;
        if (candidate) {
          console.log("[sub] ice candidate", JSON.stringify(candidate));
          this.trickle(candidate, 1);
        }
      };

      this.sub.onconnectionstatechange = (e) => {
        const { connectionState } = this.sub!;
        console.log("[sub] connstatechange", connectionState);
      };

      this.sub.ontrack = (e) => {
        console.log("houston we have a track", e);
        if (e.track.kind === "audio") {
          const audioEl = document.getElementById("saturday-audio");
          audioEl.srcObject = e.streams[0];
          console.log(e.streams[0].getAudioTracks());
        }
      };
      this.sub.ondatachannel = (e) => {
        const { channel } = e;
        console.log("got chan", channel);
        if (channel.label === "events") {
          channel.onmessage = (msg) => {
            console.log("got chan message", msg)
            const event = decodeDatachannelMessage(msg.data)
            this.onEvent(event)
          };
        }
      };
    }
  }

  toggleMic = () => {
    const audioTrack = this.stream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    this.micEnabledWr.set(audioTrack.enabled)
  };

  setMicTrack(track: MediaStreamTrack) {
    const existingTracks = this.stream.getAudioTracks()
    if (existingTracks.length === 1 && existingTracks[0] === track) {
      // short circuit if this should be a noop.
      return
    }

    for (const existingTrack of existingTracks) {
      this.stream.removeTrack(existingTrack)
    }
    this.stream.addTrack(track)

    for (const sender of this.pub!.getSenders()) {
      sender.replaceTrack(track)
    }
  }

  async socketConnect() {
    return new Promise((resolve) => {
      this.socket = new WebSocket(this.url);

      // Event listener for when the WebSocket connection is opened
      this.socket.addEventListener("open", (event) => {
        console.log("WebSocket connection opened");
        resolve();
      });

      // Event listener for when a message is received over the WebSocket
      this.socket.addEventListener("message", async (event) => {
        const data = JSON.parse(event.data);
        console.log(`WebSocket message received: ${data}`, data);
        const { result } = data;
        if (result) {
          if (result.type === "answer") {
            if (!this.pub) { throw new Error("pub is null")}
            console.log("setting ans");
            await this.pub.setRemoteDescription(data.result);
            this.pubAns = true;
            this.pubCandidates.forEach((candidate) => {
              this.trickle(candidate, 0);
            });
          }
        } else {
          const { method, params } = data;
          if (method) {
            if (method === "trickle") {
              if (params.target === 0) {
                if (!this.pub) { throw new Error("pub is null") }
                console.log("adding candidate for pub");
                await this.pub.addIceCandidate(params.candidate);
              }
              if (params.target === 1) {
                if (!this.sub) { throw new Error("sub is null") }
                console.log("adding candidate for sub");
                if (!this.subOff) {
                  this.subCandidates.push(params.candidate);
                } else {
                  await this.sub.addIceCandidate(params.candidate);
                }
              }
            } else if (method === "offer") {
              if (!this.sub) { throw new Error("sub is null") }
              console.log("setting offer");
              await this.sub.setRemoteDescription(params);
              const answer = await this.sub.createAnswer();
              await this.sub.setLocalDescription(answer);
              this.answer(answer);
              this.subOff = true;
              for (const candidate of this.subCandidates) {
                await this.sub.addIceCandidate(candidate);
              }
            }
          }
        }
      });

      // Event listener for when the WebSocket connection is closed
      this.socket.addEventListener("close", (event) => {
        console.log("WebSocket connection closed");
      });

      // Event listener for errors that occur on the WebSocket
      this.socket.addEventListener("error", (event) => {
        console.log(`WebSocket error: ${event}`);
      });
    });
  }

  async join() {
    await this.socketConnect();
    const join = {
      sid: this.room,
      uid: generateRandomString(10),
      config: {},
    };
    if (this.noSub) {
      join.config.NoSubscribe = true;
      join.config.NoAutoSubscribe = true;
    }
    if (this.noPub) {
      join.config.NoPublish = true;
    }
    const msg = {
      method: "join",
      params: join,
    };

    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        this.pub.addTransceiver(track);
      });
    }

    if (!this.noPub) {
      const offer = await this.pub.createOffer();
      await this.pub.setLocalDescription(offer);

      msg.params.offer = offer;
    }

    this.socket.send(JSON.stringify(msg));
  }

  trickle(candidate, target) {
    const msg = {
      method: "trickle",
      params: {
        target,
        candidate,
      },
    };

    this.socket.send(JSON.stringify(msg));
  }

  answer(answer) {
    console.log("answer", JSON.stringify(answer));
    this.socket.send(
      JSON.stringify({ method: "answer", params: { desc: answer } })
    );
  }
}
