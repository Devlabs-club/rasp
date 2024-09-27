import React from 'react'

interface MessageProps {
    content: string;
    timestamp: string;
    isSender: boolean;
}

const Message: React.FC<MessageProps> = ({ content, timestamp, isSender }) => {
  return (
    <div className={`flex gap-2 ${isSender ? 'self-end bg-orange-700' : 'self-start bg-stone-700'}`}>
      <p>{content}</p>
      <p>{timestamp}</p>
    </div>
  )
}

export default Message