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
    <div>
      Room : {id}
      <br />
      Your Own User Feed
      <UserFeedPlayer stream={stream} />
      {Object.keys(peers).length > 0 ? (
        <div>
          Other Users Feed
          {Object.keys(peers).map((peerId) => (
            <div key={peerId}>
              <UserFeedPlayer stream={peers[peerId].stream} />
            </div>
          ))}
        </div>
      ) : (
        "No Other Users In The Room Yet!"
      )}
    </div>
  );
};

export default Room;
