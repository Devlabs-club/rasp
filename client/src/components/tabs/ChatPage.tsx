import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext, SocketContext } from "../../pages/Dashboard";
import Message from "../chat/Message";
import { formatDate } from "../../utils/formatDateTime";
import Input from "../inputs/Input";
import SubmitButton from "../inputs/SubmitButton";

interface ChatMessage {
    _id: string;
    sender: string; // User ID or Name
    receiver: string; // User ID or Name
    content: string;
    timestamp: Date;
}

interface ChatPageProps {
    receiver: string; // Added prop for tab management
    setReceiver: (receiver: any) => void; 
}

const ChatPage: React.FC<ChatPageProps> = ({ receiver, setReceiver }) => {
    const user = useContext(UserContext);
    const socket = useContext(SocketContext);

    const [chats, setChats] = useState<any[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState<string>("");

    const getChats = async (userId: string) => {
        const response = await axios.get(`http://localhost:5000/chat/getall/${userId}`);      
        setChats(response.data);
    }

    const getMessages = async (userId: string, receiverId: string) => {
        const response = await axios.get<ChatMessage[]>(`http://localhost:5000/chat/get/${userId}/${receiverId}`);
        setMessages(response.data);
    }

    useEffect(() => {
        setMessages([]);
        setMessage("");
        getChats(user._id);

        if (receiver) {
            getMessages(user._id, receiver);
        }
    }, [user, receiver]);

    useEffect(() => {
        socket.current?.on('message', (newMessage: any) => {
            if(newMessage.sender === user._id || newMessage.sender === receiver) {
                setMessages((prevMessages) => [...prevMessages.filter(message => message._id !== newMessage._id), newMessage]);   
            }                  
        });    
        
    }, [socket, messages, user._id, receiver]);

    useEffect(() => {
        socket.current?.on('chat', (chat: any) => {
            getChats(user._id);
        });
    }, [ user._id, socket]);

    const handleChatSelect = async (chat: any) => {
        const newReceiver = chat.users.filter((u: any) => u !== user._id)[0];
        setReceiver(newReceiver || "");
    };

    const saveMessage = async (sender: any, receiver: any) => {
        // Save messages to the server
        const response = await axios.post<ChatMessage>(`http://localhost:5000/chat/save/${sender._id}/${receiver}`, { message });
        if (response.status === 201) {
        setMessage("");
        }       
      }

    return (
        <div className="flex h-full">
            <div className="h-full w-64 text-white p-4" style={{ backgroundColor: '#262626' }}>
                <h2 className="text-lg font-bold mb-4">chats</h2>
                <ul className="space-y-2">
                    {chats.map((chat, index) => (
                        <li
                            key={index}
                            onClick={() => handleChatSelect(chat)}
                            className={`flex flex-col p-2 rounded-md cursor-pointer transition-all ${chat?.users?.includes(receiver) ? "bg-gray-600" : "bg-neutral-900"}`}
                        >
                            <span className="font-medium">{chat.receiverName}</span>
                            <span>
                                {chat.lastMessage.content} - {formatDate(chat.lastMessage.timestamp)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Main Chat Panel */}
            <div className="flex-1 p-6 bg-black">
                <div className="h-full flex flex-col">
                    {receiver ? (
                        <div className="overflow-y-scroll flex flex-col-reverse gap-4 h-full">                            
                            <div className='flex gap-4'>
                                <Input name="message" placeholder="Hey, I think you're super cool!" value={message} setValue={setMessage} />
                                <SubmitButton onClick={() => saveMessage(user, receiver)} />
                            </div>

                            <div className="mt-auto flex flex-col gap-2">
                                {messages.map((message, index) => {
                                    const isSender = message.sender === user?._id;
                                    return (
                                        <Message key={index} content={message.content} timestamp={message.timestamp} isSender={isSender} />
                                    );
                                })}
                            </div>
                        </div>
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
