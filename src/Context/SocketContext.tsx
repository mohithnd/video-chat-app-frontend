import SocketIoClient from "socket.io-client";
import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as UUIDv4 } from "uuid";
import { peerReducer } from "../Reducers/peerReducer";
import { addPeerAction } from "../Actions/peerAction";
import serverConfig from "../config/serverConfig";

const WS_Server = serverConfig.VITE_WS_SERVER;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SocketContext = createContext<any | null>(null);

const socket = SocketIoClient(WS_Server);

interface Props {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();

  const [peers, dispatch] = useReducer(peerReducer, {});

  const fetchParticipantList = ({
    roomId,
    participants,
  }: {
    roomId: string;
    participants: string[];
  }) => {
    console.log("Fetched Room Participants");
    console.log(roomId, participants);
  };

  const fetchUserFeed = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setStream(stream);
  };

  useEffect(() => {
    const userId = UUIDv4();
    const newPeer = new Peer(userId, {
      host: serverConfig.VITE_PEER_SERVER_HOST,
      port: serverConfig.VITE_PEER_SERVER_PORT,
      path: serverConfig.VITE_PEER_SERVER_PATH,
    });

    setUser(newPeer);

    fetchUserFeed();

    const enterRoom = ({ roomId }: { roomId: string }) => {
      navigate(`/room/${roomId}`);
    };

    socket.on("room-created", enterRoom);

    socket.on("get-users", fetchParticipantList);
  }, []);

  useEffect(() => {
    if (!user || !stream) {
      return;
    }

    socket.on("user-joined", ({ peerId }) => {
      const call = user.call(peerId, stream);
      console.log("Calling The Peer", peerId);

      call.on("stream", () => {
        dispatch(addPeerAction(peerId, stream));
      });
    });

    user.on("call", (call) => {
      console.log("Receiving A Call", call.peer);
      call.answer(stream);

      call.on("stream", () => {
        dispatch(addPeerAction(call.peer, stream));
      });
    });

    socket.emit("ready");
  }, [user, stream]);

  return (
    <SocketContext.Provider value={{ socket, user, stream, peers }}>
      {children}
    </SocketContext.Provider>
  );
};
