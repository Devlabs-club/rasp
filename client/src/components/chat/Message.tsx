import React from 'react'
import { formatTime } from '../../utils/formatDateTime'

interface MessageProps {
    content: string;
    timestamp: Date;
    isSender: boolean;
}

const Message: React.FC<MessageProps> = ({ content, timestamp, isSender }) => {
  const alignmentClass = isSender ? "justify-end" : "justify-start"
  const bgColorClass = isSender ? "bg-orange-500" : "bg-gray-600"

  return (
    <div className={`flex ${alignmentClass}`}>
        <div
            className={`flex flex-col gap-1 max-w-xs p-2 rounded-lg text-white ${bgColorClass}`}
        >
            <p>{content}</p>
            <time className="text-xs text-gray-200 place-self-end">
                {formatTime(timestamp)}
            </time>
        </div>
    </div>
  )
}

export default Message