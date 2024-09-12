import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import ChatArea from "../Components/ChatArea";
import UserFeedPlayer from "../Components/UserFeedPlayer";
import { SocketContext } from "../Context/SocketContext";

const Room: React.FC = () => {
  const { id } = useParams();
  const { socket, user, stream, peers } = useContext(SocketContext);

  useEffect(() => {
    if (user && id) {
      console.log("User with ID:", user._id, "has joined room:", id);
      socket.emit("joined-room", { roomId: id, peerId: user._id });
      socket.emit("send-chats", { roomId: id });
    } else {
      console.warn("User or room ID is not defined.");
    }
  }, [id, user, socket]);

  return (
    <div className="flex flex-row items-start justify-center min-h-screen bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600">
      <div className="w-3/4 p-4 shadow-lg rounded-lg bg-gradient-to-br from-purple-300 to-purple-500">
        <h2 className="text-3xl font-bold mb-4 text-purple-800">My Feed</h2>
        <UserFeedPlayer stream={stream} />
        {Object.keys(peers).length > 0 && (
          <div>
            <h2 className="text-3xl font-bold my-4 text-purple-800">
              Others' Feed
            </h2>
            <div className="flex flex-wrap justify-start gap-4">
              {Object.keys(peers).map((peerId) => (
                <div key={peerId}>
                  <UserFeedPlayer stream={peers[peerId].stream} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="w-1/4 p-4 shadow-lg rounded-lg bg-gradient-to-br from-purple-300 to-purple-500">
        <ChatArea />
      </div>
    </div>
  );
};

export default Room;
