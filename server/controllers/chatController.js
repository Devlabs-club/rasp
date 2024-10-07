import Chat from '../models/chatModel.js';
import Message from '../models/messageModel.js';
import { User } from '../models/userModel.js';
import connectedClients from '../utils/connectedClients.js';

const getChats = async (req, res) => {
  const chatDocuments = await Chat.find({ users: { $all: [req.params.userId] } });
  const chats = [];
  for (const chat of chatDocuments) {
    const lastMessage = await Message.findById(chat.messages[chat.messages.length - 1]);
    const receiverName = (await User.findById(chat.users.find(userId => userId != req.params.userId)))?.name;
    chats.push(
      {_id: chat._id,
        users: chat.users,
        groupName: chat.groupName,
        isGroupChat: chat.isGroupChat,
        pendingApprovals: chat.pendingApprovals,
        lastMessage,
        receiverName 
      });
  }
  chats.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
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
  await chat.save();
  
  res.status(201).json("Success");
}

const createGroupChat = async (req, res) => {
  const { admin, users, name } = req.body;

  const chat = await Chat.create({
    users: [admin, ...users],
    groupName: name,
    admin,
    messages: [],
    isGroupChat: true,
    pendingApprovals: users
  });

  res.status(201).json(chat);
}

const updateGroupChat = async (req, res) => {
  const { chatId, name, users, admin } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  if (chat.admin !== admin) {
    return res.status(403).json({ message: 'Only admin can update the chat' });
  }

  if (name) {
    chat.name = name;
  }

  if (users && users.length > 0) {
    chat.pendingApprovals = [...chat.pendingApprovals, ...users];
  }

  await chat.save();

  res.status(200).json(chat);
}

const approveGroupChatRequest = async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  if (!chat.pendingApprovals.includes(userId)) {
    return res.status(400).json({ message: 'No pending approval for this user' });
  }

  chat.pendingApprovals = chat.pendingApprovals.filter(id => id !== userId);
  chat.users.push(userId);

  await chat.save();

  res.status(200).json(chat);
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
  const chatData = change.documentKey;

  const chat = await Chat.findById(chatData?._id);
  const lastMessage = await Message.findById(chat.messages[chat.messages.length - 1]);
  const changedChat =
    {_id: chat._id,
      users: chat.users,
      lastMessage
    };

  for (const user of (chat?.users || [])) {
    if (connectedClients[user]) {
      connectedClients[user].emit('chat', changedChat);
    }
  }
});

export { getMessages, saveMessages, getChats, createGroupChat, updateGroupChat, approveGroupChatRequest };