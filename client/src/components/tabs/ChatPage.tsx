import React, { useState, useEffect, useContext } from "react";
import Chat from "../chat/Chat"; 
import { UserContext } from "../../pages/Dashboard";

interface ChatMessage {
    sender: string; 
    receiver: string; 
    content: string;
    timestamp: Date;
    date: Date; 
}

const ChatPage: React.FC = () => {
    const user = useContext(UserContext);
    const [pastChats, setPastChats] = useState<ChatMessage[]>([]);
    const [selectedChat, setSelectedChat] = useState<ChatMessage[]>([]);
    const [currentChatUser, setCurrentChatUser] = useState<string | null>(null);

    useEffect(() => {
        // Replace with actual API call to fetch past chats
    }, []);

    const handleChatSelect = (chat: ChatMessage) => {
        setCurrentChatUser(chat.receiver);
        setSelectedChat(pastChats.filter(c => c.sender === chat.sender && c.receiver === chat.receiver));
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US");
    };

    return (
        <div className="flex h-screen">
            <div className="fixed top-0 left-20 h-full w-64 text-white p-4" style={{ backgroundColor: '#262626' }}>
                <h2 className="text-lg font-bold mb-4">Chats</h2>
                <ul className="space-y-2">
                    {pastChats.map((chat, index) => (
                        <li
                            key={index}
                            onClick={() => handleChatSelect(chat)}
                            className={`p-2 rounded-md cursor-pointer transition-all ${currentChatUser === chat.receiver ? "bg-gray-600" : ""}`}
                        >
                            {/* <UserCard user={{ name: chat.receiver }} /> */}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Chat Panel */}
            <div className="ml-64 flex-1 p-6 bg-black">
                <div className="h-full flex flex-col">
                    {selectedChat.length > 0 ? (
                        <>
                            <div className="flex-1 overflow-y-auto">
                                {selectedChat.map((message, index) => {
                                    const isSender = message.sender === user?.name; 
                                    return (
                                        <div key={index} className={`flex ${isSender ? "justify-end" : "justify-start"} mb-4`}>
                                            <div
                                                className={`max-w-xs p-2 rounded-lg text-white ${isSender ? "bg-orange-500" : "bg-gray-600"}`}
                                            >
                                                {message.content}
                                                <div className="text-xs text-gray-300 mt-1">
                                                    {formatTime(message.timestamp)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-4 text-gray-500">
                                {formatDate(selectedChat[0].date)}
                            </div>

                            {/* Chat input component goes here */}
                            <Chat receiver={currentChatUser} />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Select a chat to start messaging!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
