export class Session {
  constructor(url) {
    this.signals = new WebSocket(url);
    this.peer = new RTCPeerConnection();
    this.peer.onicecandidate = e => {
      if (!e.candidate) return;
      this.signals.send(JSON.stringify({event: 'candidate', data: JSON.stringify(e.candidate)}));
    };
    this.signals.onmessage = e => {
      const signal = JSON.parse(e.data);
      if (!signal) {
        console.error('failed to parse signal');
        return;
      }

      switch (signal.event) {
        case 'offer':
          const offer = JSON.parse(signal.data);
          if (!offer) {
            console.error('failed to parse answer');
            return;
          }
          this.peer.setRemoteDescription(offer);
          this.peer.createAnswer().then(answer => {
            this.peer.setLocalDescription(answer);
            this.signals.send(JSON.stringify({event: 'answer', data: JSON.stringify(answer)}));
          });
          return;

        case 'candidate':
          const candidate = JSON.parse(signal.data);
          if (!candidate) {
            console.error('failed to parse candidate');
            return;
          }
          this.peer.addIceCandidate(candidate);
          return;
      }
    }
  }

  setStream(stream) {
    const videoTrack = stream.getVideoTracks()[0];
    const audioTrack = stream.getAudioTracks()[0];

    const videoSender = this.peer.getSenders().find((s) => s.track && s.track.kind == videoTrack.kind);
    const audioSender = this.peer.getSenders().find((s) => s.track && s.track.kind == audioTrack.kind);

    if (videoSender) {
      // console.log("replacing video track:", videoTrack.id);
      videoSender.replaceTrack(videoTrack);
    } else {
      // console.log("adding video track:", videoTrack.id);
      this.peer.addTrack(videoTrack, stream);
    }

    if (audioSender) {
      audioSender.replaceTrack(audioTrack);
    } else {
      this.peer.addTrack(audioTrack, stream);
    }
  }

  set ontrack(fn) { this.peer.ontrack = fn; }
  set onerror(fn) { this.signals.onerror = fn; }
  set onclose(fn) { this.signals.onclose = fn; }
}
