import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";
import IMessage from "../types/IMessage";

const ChatArea: React.FC = () => {
  const [chat, setChat] = useState("");
  const { user, messages, sendMessage } = useContext(SocketContext);
  const { id } = useParams();

  const handleSendMessage = () => {
    if (!chat || !user) {
      console.warn("Chat input is empty or user is not defined.");
      return;
    }
    console.log("Sending message:", {
      roomId: id,
      message: chat,
      senderId: user._id,
    });
    sendMessage(id, chat, user._id);
    setChat("");
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold mb-4 text-purple-800">Chat</h2>
      <div className="bg-white p-4 rounded-lg shadow-lg h-96 overflow-y-auto border border-purple-300">
        {messages.map((msg: IMessage) => (
          <div
            key={msg.messageId}
            className={`flex mb-2 ${
              msg.senderId === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-md p-2 rounded-lg shadow ${
                msg.senderId === user._id
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <p className="text-sm text-gray-600 mb-1">{msg.timestamp} </p>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          className="flex-1 p-2 bg-purple-50 text-black rounded-l-lg border border-purple-300 focus:outline-none focus:border-purple-500 transition duration-300 ease-in-out"
          type="text"
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          placeholder="Type your message here..."
        />
        <button
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-r-lg shadow transition duration-300 ease-in-out"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
