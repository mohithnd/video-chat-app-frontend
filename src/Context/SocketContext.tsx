import Peer from "peerjs";
import { createContext, useEffect, useMemo, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import SocketIoClient from "socket.io-client";
import { v4 as UUIDv4 } from "uuid";

import { addPeerAction, removePeerAction } from "../Actions/peerAction";
import serverConfig from "../config/serverConfig";
import { peerReducer } from "../Reducers/peerReducer";
import IMessage from "../Types/IMessage";
import IProps from "../Types/IProps";

const WS_Server = serverConfig.VITE_WS_SERVER;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SocketContext = createContext<any | null>(null);

const socket = SocketIoClient(WS_Server);

export const SocketProvider: React.FC<IProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [messages, setMessages] = useState<IMessage[]>([]);
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
    socket.on(
      "receive-message",
      ({ message, senderId, timestamp, messageId }) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message, senderId, timestamp, messageId },
        ]);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    socket.on("user-disconnected", ({ peerId }) => {
      dispatch(removePeerAction(peerId));

      const videoElement = document.getElementById(peerId);
      if (videoElement) {
        videoElement.remove();
      }
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

  const sendMessage = (roomId: string, message: string, senderId: string) => {
    const timestamp = new Date().toLocaleTimeString();
    socket.emit("send-message", { roomId, message, senderId, timestamp });
  };

  const value = useMemo(
    () => ({ socket, user, stream, peers, messages, sendMessage }),
    [user, stream, peers, messages]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
