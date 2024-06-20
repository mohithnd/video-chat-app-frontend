import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";
import UserFeedPlayer from "../Components/UserFeedPlayer";

const Room: React.FC = () => {
  const { id } = useParams();
  const { socket, user, stream, peers, messages, sendMessage } =
    useContext(SocketContext);
  const [chat, setChat] = useState("");

  useEffect(() => {
    if (user) {
      console.log("New User With ID", user._id, "has joined room", id);
      socket.emit("joined-room", { roomId: id, peerId: user._id });
    }
  }, [id, user, socket]);

  const handleSendMessage = () => {
    if (!chat) {
      return;
    }
    sendMessage(id, chat);
    setChat("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      <h1 className="text-3xl font-bold mb-8">Room: {id}</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Feed</h2>
        <UserFeedPlayer stream={stream} />
      </div>
      {Object.keys(peers).length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Other's Feed</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.keys(peers).map((peerId) => (
              <div key={peerId}>
                <UserFeedPlayer stream={peers[peerId].stream} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-lg">No Other Users In The Room Yet!</p>
      )}
      <div className="w-full max-w-md mt-8">
        <h2 className="text-xl font-semibold mb-4">Chat</h2>
        <div className="bg-white text-black p-4 rounded-lg shadow-md h-64 overflow-y-auto">
          {messages.map((msg: string, index: string) => (
            <div key={index} className="mb-2">
              {msg}
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            value={chat}
            onChange={(e) => setChat(e.target.value)}
            className="flex-1 p-2 rounded-l-lg border border-gray-300"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-indigo-600 text-white rounded-r-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room;
