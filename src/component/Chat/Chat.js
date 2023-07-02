import React, { useEffect, useState } from "react";
import { user } from "../Join/Join";
import { io } from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../images/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";

let socket;

const Chat = () => {
  const [id, setid] = useState("");
  const [messages, setmessages] = useState([]);

  const send = () => {
    const message = document.getElementById("chatInput").value;
    socket.emit("message", { message, id });
    document.getElementById("chatInput").value = "";
  };

  useEffect(() => {
    socket = io("http://localhost:4500/");
    socket.on("connect", () => {
      setid(socket.id);
    });
    socket.emit("joined", { user });
    socket.on("welcome", (data) => {
      setmessages([...messages, data]);
    });
    socket.on("userJoined", (data) => {
      setmessages([...messages, data]);
    });
    socket.on("leave", (data) => {
      setmessages([...messages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      setmessages([...messages, data]);
    });
    return () => {
      socket.off();
    };
  }, [messages]);

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header">
          <h2>iChat</h2>
          <a href="/">
            <img src={closeIcon} alt="closeIcon" />
          </a>
        </div>
        <ReactScrollToBottom className="chatBox">
          {messages.map((item, i) => (
            <Message
              key={i}
              user={item.id === id ? "" : item.user}
              message={item.message}
              classs={item.id === id ? "right" : "left"}
            />
          ))}
        </ReactScrollToBottom>
        <div className="inputBox">
          <input onKeyPress={(event) => event.key === 'Enter' ? send() : null} type="text" id="chatInput" />
          <button onClick={send} className="sendBtn">
            <img src={sendLogo} alt="sendLogo" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
