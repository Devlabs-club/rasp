import Chat from '../models/chatModel.js';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';
import connectedClients from '../utils/connectedClients.js';

const getChats = async (req, res) => {
  const chatDocuments = await Chat.find({ users: req.params.userId });
  const chats = [];
  for (const chat of chatDocuments) {
    const lastMessage = await Message.findById(chat.messages[chat.messages.length - 1]);
    const receiverName = (await User.findById(chat.users.find(userId => userId != req.params.userId)))?.name;
    chats.push(
      {...chat, 
        lastMessage,
        receiverName 
      });
  }
  res.json(chats);
}

const getMessages = async (req, res) => {
  const messageIds = (await Chat.findOne({ users: { $all: [req.params.sender, req.params.receiver] } }))?.messages || [];

  const messages = [];
  for (const messageId of messageIds) {
    const message = await Message.findById(messageId);
    messages.push(message);
  }
  
  res.json(messages);
}

const saveMessages = async (req, res) => {
  const newMessage = await Message.create({
    sender: req.params.sender,
    receiver: req.params.receiver,
    content: req.body.message,
    timestamp: Date.now(),
  });

  let chat = await Chat.findOne({ users: { $all: [req.params.sender, req.params.receiver] } });
  if (!chat) {
    chat = await Chat.create({users: [req.params.sender, req.params.receiver], messages: []});
  }
  chat.messages = [...chat.messages, newMessage._id];
  chat.lastMessage = newMessage;
  // sort chat in descending order of timestamp
  chat.sort((a, b) => b.timestamp - a.timestamp);
  chat.save();
  
  res.status(201).json("Success");
}

const messageChangeStream = Message.watch();
messageChangeStream.on('change', async (change) => {
  const messageData = change.fullDocument;

  if(change.operationType !== 'insert') return;

  const message = await Message.findById(messageData?._id);

  if (connectedClients[messageData?.sender]) {
    connectedClients[messageData?.sender].emit('message', message);
  }
  if (connectedClients[messageData?.receiver]) {
    connectedClients[messageData?.receiver].emit('message', message);
  }
});

const chatChangeStream = Chat.watch();
chatChangeStream.on('change', async (change) => {
  const chatData = change.fullDocument;

  const chat = await Chat.findById(chatData?._id);

  for (const user of (chatData?.users || [])) {
    if (connectedClients[user]) {
      connectedClients[user].emit('chat', chat);
    }
  }
});

export { getMessages, saveMessages, getChats };