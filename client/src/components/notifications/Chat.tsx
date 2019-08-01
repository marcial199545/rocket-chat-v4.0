import React from "react";
import ChatSidebar from "./ChatSidebar";
import ChatMain from "./ChatMain";
const Chat = () => {
    return (
        <div className="chat">
            <ChatSidebar />
            <ChatMain />
        </div>
    );
};

export default Chat;
