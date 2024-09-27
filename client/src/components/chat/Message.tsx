import React from 'react'

interface MessageProps {
    content: string;
    timestamp: string;
    status: string;
    isSender: boolean;
}

const Message: React.FC<MessageProps> = ({ content, timestamp, status, isSender }) => {
  return (
    <div className={`flex gap-2 ${isSender ? 'self-end bg-orange-700' : 'self-start bg-stone-700'}`}>
      <p>{content}</p>
      <p>{timestamp}</p>
      { isSender ? <p>{status}</p> : <></> }
    </div>
  )
}

export default Message