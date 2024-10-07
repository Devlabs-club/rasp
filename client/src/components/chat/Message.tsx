import React from 'react'
import { formatTime } from '../../utils/formatDateTime'

interface MessageProps {
    content: string;
    timestamp: Date;
    isSender: boolean;
}

const Message: React.FC<MessageProps> = ({ content, timestamp, isSender }) => {
  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
        <div
            className={`flex flex-col gap-1 max-w-xs p-2 rounded-lg text-white ${isSender ? "bg-orange-500" : "bg-gray-600"}`}
        >
            {content}
            <div className="text-xs text-gray-200 place-self-end">
                {formatTime(timestamp)}
            </div>
        </div>
    </div>
  )
}

export default Message