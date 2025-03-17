import Peer from "peerjs";
import { createContext, useEffect, useMemo, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import SocketIoClient from "socket.io-client";
import { v4 as UUIDv4 } from "uuid";
import { addPeerAction, removePeerAction } from "../actions/peerAction";
import serverConfig from "../configs/serverConfig";
import { peerReducer } from "../reducers/peerReducer";
import IMessage from "../types/IMessage";
import IProps from "../types/IProps";

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
    console.log("Fetching Room Participants:", { roomId, participants });
  };

  const fetchUserFeed = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(stream);
      console.log("User media stream fetched successfully.");
    } catch (error) {
      console.error("Error fetching user media:", error);
    }
  };

  const sendMessage = (roomId: string, message: string, senderId: string) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log("Sending message:", { roomId, message, senderId, timestamp });
    socket.emit("send-message", { roomId, message, senderId, timestamp });
  };

  const enterRoom = ({ roomId }: { roomId: string }) => {
    console.log("Entering room:", roomId);
    navigate(`/room/${roomId}`);
  };

  useEffect(() => {
    socket.on("room-created", enterRoom);
    socket.on("get-users", fetchParticipantList);
    socket.on(
      "receive-message",
      ({ message, senderId, timestamp, messageId }) => {
        console.log("Message received:", {
          message,
          senderId,
          timestamp,
          messageId,
        });
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message, senderId, timestamp, messageId },
        ]);
      }
    );
    socket.on("receive-chats", ({ chats }: { chats: IMessage[] }) => {
      console.log("Chats received:", chats);
      setMessages(chats);
    });

    return () => {
      socket.off("room-created", enterRoom);
      socket.off("get-users", fetchParticipantList);
      socket.off("receive-message");
      socket.off("receive-chats");
    };
  }, []);

  useEffect(() => {
    const userId = UUIDv4();
    const newPeer = new Peer(userId, {
      host: serverConfig.VITE_PEER_SERVER_HOST,
      port: serverConfig.VITE_PEER_SERVER_PORT,
      path: serverConfig.VITE_PEER_SERVER_PATH,
    });

    setUser(newPeer);
    fetchUserFeed();
    console.log("New peer created with ID:", userId);
  }, []);

  useEffect(() => {
    if (!user || !stream) {
      console.log(
        "User or stream not available, skipping peer connection setup."
      );
      return;
    }

    const handleUserJoined = ({ peerId }: { peerId: string }) => {
      console.log("User joined:", peerId);
      const call = user.call(peerId, stream);
      call.on("stream", () => {
        dispatch(addPeerAction(peerId, stream));
        console.log("Stream added for peer:", peerId);
      });
    };

    const handleUserDisconnected = ({ peerId }: { peerId: string }) => {
      console.log("User disconnected:", peerId);
      dispatch(removePeerAction(peerId));
      const videoElement = document.getElementById(peerId);
      if (videoElement) {
        videoElement.remove();
        console.log("Video element removed for peer:", peerId);
      }
    };

    user.on("call", (call) => {
      console.log("Receiving a call from:", call.peer);
      call.answer(stream);
      call.on("stream", () => {
        dispatch(addPeerAction(call.peer, stream));
        console.log("Stream added for incoming call from peer:", call.peer);
      });
    });

    socket.on("user-joined", handleUserJoined);
    socket.on("user-disconnected", handleUserDisconnected);
    socket.emit("ready");
  }, [user, stream]);

  const value = useMemo(
    () => ({
      socket,
      user,
      stream,
      peers,
      messages,
      sendMessage,
    }),
    [user, stream, peers, messages]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
