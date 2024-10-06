import React, { useState, useEffect, useContext } from "react";
import Chat from "../chat/Chat"; 
import { UserContext } from "../../pages/Dashboard";

interface ChatMessage {
    sender: string; // User ID or Name
    receiver: string; // User ID or Name
    content: string;
    timestamp: Date;
    date: Date; // For displaying date stamps
}

interface ChatPageProps {
    chatReceiver: any; // Added prop for tab management
    setChatReceiver: (receiver: any) => void; 
}

const ChatPage: React.FC<ChatPageProps> = ({ chatReceiver, setChatReceiver }) => {
    const user = useContext(UserContext);
    const [pastChats, setPastChats] = useState<ChatMessage[]>([]);
    const [selectedChat, setSelectedChat] = useState<ChatMessage[]>([]);

    // Sample data for past chats
    useEffect(() => {
        // Replace with actual API call to fetch past chats
        setPastChats([
            { sender: "Alice", receiver: "Bob", content: "Hey!", timestamp: new Date(), date: new Date() },
            { sender: "Bob", receiver: "Alice", content: "Hi!", timestamp: new Date(), date: new Date() },
            // Add more sample chats here...
        ]);
    }, []);

    const handleChatSelect = (chat: ChatMessage) => {
        setChatReceiver(chat.receiver);
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
                            className={`p-2 rounded-md cursor-pointer transition-all ${chatReceiver === chat.receiver ? "bg-gray-600" : ""}`}
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
                                    const isSender = message.sender === user?.name; // Assuming `user.name` gives the current user's name
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
                                {formatDate(selectedChat[0].date)} {/* Display date stamp */}
                            </div>

                            {/* Chat input component goes here */}
                            <Chat receiver={chatReceiver} />
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
