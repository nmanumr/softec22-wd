import { useLayoutEffect, useRef } from "react";
import useSWR from "swr";

export default function Call() {
  const ref = useRef<HTMLInputElement>(null);
  const peerRef = useRef<any>(null);
  const {data} = useSWR('/api/user/current');

  useLayoutEffect(() => {
    if (!data) return;

    import('peerjs').then(({ default: Peer }) => {
      peerRef.current = new Peer(
        data?.id, {
          host: "18.212.53.56",
          port: 80,
          path: "/peerjs",
          config: {
            iceServers: [{
              urls: "stun:stun.l.google.com:19302"
            }, {
              urls: "turn:18.212.53.56:3478",
              credential: "nothanks",
              username: "nothanks"
            }]
          }
        }
      );
      window.peer = peerRef.current;
      peerRef.current?.on('open', function (id: any) {
        console.log('My peer ID is: ' + id);
      });
    });
  }, [data]);

  function call() {
    const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    getUserMedia({ video: true, audio: true }, function (stream: any) {
      var call = peerRef.current?.call(ref.current?.value as string, stream);
      call.on('stream', function (remoteStream: any) {
        console.log('here', remoteStream);
      });
    }, function (err: any) {
      console.log('Failed to get local stream', err);
    });
  }

  return (
    <div>
      <input ref={ref}/>
      <button onClick={call}>Call</button>
    </div>
  );
}