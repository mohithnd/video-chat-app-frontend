import React, { useContext, useState } from "react";
import { SocketContext } from "../Context/SocketContext";
import { useParams } from "react-router-dom";

const ChatArea: React.FC = () => {
  const [chat, setChat] = useState("");

  const { user, messages, sendMessage } = useContext(SocketContext);

  const { id } = useParams();

  const handleSendMessage = () => {
    if (!chat) {
      return;
    }
    sendMessage(id, chat, user._id);
    setChat("");
  };

  return (
    <div className="w-full max-w-md mt-8">
      <h2 className="text-xl font-semibold mb-4">Chat</h2>
      <div className="bg-white text-black p-4 rounded-lg shadow-md h-64 overflow-y-auto">
        {messages.map(
          (msg: { text: string; senderId: string }, index: number) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.senderId === user._id ? "bg-blue-100" : "bg-gray-100"
              } p-2 rounded`}
            >
              {msg.text}
            </div>
          )
        )}
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
  );
};

export default ChatArea;
