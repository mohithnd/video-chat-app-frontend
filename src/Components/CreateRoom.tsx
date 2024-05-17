import { useContext } from "react";
import { SocketContext } from "../Context/SocketContext";

const CreateRoom: React.FC = () => {
  const { socket } = useContext(SocketContext);

  const initRoom = () => {
    console.log("Sending A Request To Create A Room");
    socket.emit("create-room");
  };

  return (
    <button onClick={initRoom} className="btn btn-secondary">
      Start A New Meeting In A New Room
    </button>
  );
};

export default CreateRoom;
