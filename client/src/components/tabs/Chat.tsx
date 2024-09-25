import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
}

interface Message {
  content: string;
  timestamp: string;
}

interface ChatProps {
  sender: User;
  receiver: User;
}

const Chat: React.FC<ChatProps> = ({ sender, receiver }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const getMessages = async (sender: User, receiver: User) => {
    // fetch messages from the server
    const response = await axios.get<Message[]>(`http://localhost:5000/chat/get/${sender._id}/${receiver._id}`);
    setMessages(response.data);
  }

  useEffect(() => {
    // This function will only run once, on the initial render
    getMessages(sender, receiver);
  }, [sender, receiver]);

  const saveMessage = async (sender: User, receiver: User) => {
    // save messages to the server
    const formattedMessage = (await axios.post<Message>(`http://localhost:5000/chat/save/${sender._id}/${receiver._id}`, { message })).data;
    console.log(formattedMessage);
    setMessages(messages => [...messages, formattedMessage]);
  }

  return (
    <div>
      <h1>Send a message to {receiver.name}</h1>

      <div className='flex flex-col gap-4'>
        {messages.map((message, index) => {
          return (
            <div key={index} className="flex gap-4">
              <p className='text-white'>{message.content}</p>
              <p>{message.timestamp}</p>
            </div>
          );
        })}
      </div>

      <input type="text" placeholder="Type your message here" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={() => saveMessage(sender, receiver)}>Send Message</button>
    </div>
  )
}

export default Chat;