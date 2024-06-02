import { useContext } from "react";
import { SocketContext } from "../Context/SocketContext";

const CreateRoom: React.FC = () => {
  const { socket } = useContext(SocketContext);

  const initRoom = () => {
    console.log("Sending A Request To Create A Room");
    socket.emit("create-room");
  };

  return (
    <button
      onClick={initRoom}
      className="px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out"
    >
      Start A New Meeting In A New Room
    </button>
  );
};

export default CreateRoom;
