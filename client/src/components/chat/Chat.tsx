import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext, SocketContext } from '../../pages/Dashboard';

import Message from './Message';

interface MessageType {
  content: string;
  timestamp: string;
  sender: string;
  receiver: string;
}

interface ChatProps {
  receiver: any;
}

const Chat: React.FC<ChatProps> = ({ receiver }) => {
  const socket = useContext(SocketContext);
  const user = useContext(UserContext);

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [chats, setChats] = useState<any[]>([]);

  const getMessages = async (user: any, receiver: any) => {
    // fetch messages from the server
    const response = await axios.get<MessageType[]>(`http://localhost:5000/chat/get/${user._id}/${receiver._id}`);
    setMessages(response.data);
  }

  const getChats = async (user: any) => {
    const response = await axios.get(`http://localhost:5000/chat/getall/${user._id}`);
    setChats(response.data);
  }

  useEffect(() => {
    // This function will only run once, on the initial render
    getMessages(user, receiver);
    getChats(user);

    socket.current?.on('message', async (newMessage: any) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);    
    });

    socket.current?.on('chat', async (chat: any) => {
      setChats(chats => [chat, ...chats.filter((c) => c._id !== chat._id)]);
    });
  }, [user, socket, receiver]);

  const saveMessage = async (sender: any, receiver: any) => {
    // save messages to the server
    const response = (await axios.post<MessageType>(`http://localhost:5000/chat/save/${sender._id}/${receiver._id}`, { message }));
    console.log(response);
    if (response.status === 201) {
      setMessage("");
    }
  }

  return (
    <div className="bg-neutral-800 grid grid-cols-3">
      <div className="col-span-1">
        {chats.map((chat, index) => {
            return (
              <div>
                <p>{chat.receiverName}</p>
                <p>{chat.lastMessage.content} {chat.lastMessage.timestamp}</p>
                <hr />
              </div>
            );
          })
        }
      </div>
      <div className="col-span-2">
        <h1>Send a message to {receiver.name}</h1>

        <div className='flex flex-col gap-2'>
          {messages.map((message, index) => {
            return (
              <Message key={index} content={message.content} timestamp={message.timestamp} isSender={message.sender === user._id} />
            );
          })}
        </div>

        <input className="text-black" type="text" placeholder="Type your message here" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={() => saveMessage(user, receiver)}>Send Message</button>
      </div>
      
    </div>
  )
}

export default Chat;