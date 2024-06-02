import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";
import UserFeedPlayer from "../Components/UserFeedPlayer";

const Room: React.FC = () => {
  const { id } = useParams();
  const { socket, user, stream, peers } = useContext(SocketContext);

  useEffect(() => {
    if (user) {
      console.log("New User With ID", user._id, "has joined room", id);
      socket.emit("joined-room", { roomId: id, peerId: user._id });
    }
  }, [id, user, socket]);

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
    </div>
  );
};

export default Room;
