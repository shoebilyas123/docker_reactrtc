import React, {
  useContext,
  useRef,
  useState,
  useEffect,
  createContext,
} from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

export const SocketContext = createContext();

const socket = io('http://localhost:5000');

const ContextProvider = ({ children }) => {
  const [myStream, setMyStream] = useState(null);
  const [call, setCall] = useState({});
  const [me, setMe] = useState(null);
  const [name, setName] = useState('');
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const myVideoRef = useRef();
  const userVideoRef = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((currentStream) => {
        setMyStream(currentStream);

        myVideoRef.current.srcObject = currentStream;
      });

    socket.on('me', (mySocketId) => {
      setMe(mySocketId);
    });
    socket.on('callUser', ({ from, name, signal }) => {
      setCall({ isReceivedCall: true, from, name, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,

      trickle: false,
      stream: myStream,
    });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });
    peer.on('stream', (remoteStream) => {
      userVideoRef.current.srcObject = remoteStream;
    });
    peer.on('end', leaveCall);

    peer.signal(call.signal);
    connectionRef.current = peer;
  };
  const callUser = (_id) => {
    const peer = new Peer({
      initiator: true,

      trickle: false,
      stream: myStream,
    });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: _id,
        from: me,
        signalData: data,
        name,
      });
    });
    peer.on('stream', (remoteStream) => {
      userVideoRef.current.srcObject = remoteStream;
    });

    peer.on('end', leaveCall);
    peer.socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };
  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  useEffect(() => {}, []);

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideoRef,
        userVideoRef,
        myStream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        answerCall,
        leaveCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default ContextProvider;
