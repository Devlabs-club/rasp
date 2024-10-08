import React, { useEffect } from "react";
import useSocketStore from '../../states/socketStore';
import useUserStore from '../../states/userStore';
import useChatStore, { ChatMessage } from '../../states/chatStore';
import Message from "../chat/Message";
import { formatDate } from "../../utils/formatDateTime";
import Input from "../inputs/Input";
import SubmitButton from "../inputs/SubmitButton";

const ChatPage: React.FC = () => {
    const { user } = useUserStore();
    const { 
        chats, 
        messages, 
        currentReceiver, 
        message,
        setMessage,
        setMessages, 
        setCurrentReceiver, 
        getChats, 
        getMessages, 
        saveMessage 
    } = useChatStore();

    const { socket } = useSocketStore();

    useEffect(() => {
        setMessages([]);
        setMessage("");
        getChats(user._id);

        if (currentReceiver) {
            getMessages(user._id, currentReceiver);
            setCurrentReceiver(currentReceiver);
        }
    }, [user, currentReceiver, getChats, getMessages, setMessages, setCurrentReceiver, setMessage]);

    useEffect(() => {
        socket?.on('message', (newMessage: ChatMessage) => {
            if(newMessage.sender === user._id || newMessage.sender === currentReceiver) {
                setMessages([...messages, newMessage]);
            }        
        });
    }, [messages, socket, setMessages, user._id, currentReceiver]);

    useEffect(() => {
        socket?.on('chat', () => {
            getChats(user._id);
        });
    }, [user._id, socket, getChats]);

    const handleChatSelect = (chat: any) => {
        const newReceiver = chat.users.filter((u: string) => u !== user._id)[0];
        setCurrentReceiver(newReceiver || "");
    };

    const handleSaveMessage = async () => {
        await saveMessage(user._id, currentReceiver, message);
        setMessage("");
    };

    return (
        <div className="flex h-full">
            <div className="h-full w-64 text-white p-4" style={{ backgroundColor: '#262626' }}>
                <h2 className="text-lg font-bold mb-4">chats</h2>
                <ul className="space-y-2">
                    {chats.map((chat, index) => (
                        <li
                            key={index}
                            onClick={() => handleChatSelect(chat)}
                            className={`flex flex-col p-2 rounded-md cursor-pointer transition-all ${chat?.users?.includes(currentReceiver) ? "bg-gray-600" : "bg-neutral-900"}`}
                        >
                            <span className="font-medium">{chat.currentReceiverName}</span>
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
                    {currentReceiver ? (
                        <div className="overflow-y-scroll flex flex-col-reverse gap-4 h-full">                            
                            <div className='flex gap-4'>
                                <Input name="message" placeholder="Hey, I think you're super cool!" value={message} setValue={setMessage} />
                                <SubmitButton onClick={handleSaveMessage} />
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