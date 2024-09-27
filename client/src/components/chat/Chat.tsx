import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

import Message from './Message';

interface User {
  _id: string;
  name: string;
}

interface MessageType {
  content: string;
  timestamp: string;
  status: string;
  sender: string;
  receiver: string;
}

interface ChatProps {
  sender: User;
  receiver: User;
}

const Chat: React.FC<ChatProps> = ({ sender, receiver }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);

  const getMessages = async (sender: User, receiver: User) => {
    // fetch messages from the server
    const response = await axios.get<MessageType[]>(`http://localhost:5000/chat/get/${sender._id}/${receiver._id}`);
    setMessages(response.data);
  }

  useEffect(() => {
    // This function will only run once, on the initial render
    getMessages(sender, receiver);

    const socket = io('http://localhost:5000', {
      query: { userId: sender._id } // Pass the userId when connecting to the server
    });

    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [sender, receiver]);

  const saveMessage = async (sender: User, receiver: User) => {
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

      </div>
      <div className="col-span-2">
        <h1>Send a message to {receiver.name}</h1>

        <div className='flex flex-col gap-2'>
          {messages.map((message, index) => {
            return (
              <Message key={index} content={message.content} timestamp={message.timestamp} status={message.status} isSender={message.sender === sender._id} />
            );
          })}
        </div>

        <input className="text-black" type="text" placeholder="Type your message here" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={() => saveMessage(sender, receiver)}>Send Message</button>
      </div>
      
    </div>
  )
}

export default Chat;