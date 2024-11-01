import { useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";

const CreateRoom: React.FC = () => {
  const { socket } = useContext(SocketContext);

  const initRoom = () => {
    console.log("Requesting to create a new room.");
    socket.emit("create-room");
  };

  return (
    <button
      onClick={initRoom}
      className="px-6 py-3 text-lg font-bold text-white bg-purple-600 rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out border-2 border-purple-500"
    >
      Start a New Meeting in a New Room
    </button>
  );
};

export default CreateRoom;
