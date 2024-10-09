import Chat from '../models/chatModel.js';
import Message from '../models/messageModel.js';
import { User } from '../models/userModel.js';
import { emitToConnectedClient, publish } from '../utils/connectedClients.js';

const getChats = async (req, res) => {
  const chatDocuments = await Chat.find({ users: { $all: [req.params.userId] } });
  const chats = [];
  for (const chat of chatDocuments) {
    const otherUser = await User.findById(chat.users.find(userId => userId != req.params.userId));
    chats.push({
      _id: chat._id,
      users: chat.users,
      groupName: chat.groupName,
      isGroupChat: chat.isGroupChat,
      pendingApprovals: chat.pendingApprovals,
      lastMessage: chat.lastMessage,
      otherUserName: otherUser?.name
    });
  }
  
  // Sort chats, handling null lastMessage
  chats.sort((a, b) => {
    if (!a.lastMessage) return 1;  // Move chats without lastMessage to the end
    if (!b.lastMessage) return -1; // Move chats without lastMessage to the end
    return b.lastMessage.timestamp - a.lastMessage.timestamp;
  });
  
  res.json(chats);
}

const getMessages = async (req, res) => {
  const chat = await Chat.findById(req.params.chatId);
  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  const messages = await Message.find({ _id: { $in: chat.messages } });
  res.json(messages);
}

const saveMessage = async (req, res) => {
  const chat = await Chat.findById(req.params.chatId);
  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  const sender = await User.findById(req.body.senderId);
  if (!sender) {
    return res.status(404).json({ message: 'Sender not found' });
  }

  const newMessage = await Message.create({
    sender: req.body.senderId,
    chat: req.params.chatId, // This is now just the chat ID
    content: req.body.message,
    timestamp: Date.now(),
  });

  chat.messages.push(newMessage._id);
  chat.lastMessage = {
    messageId: newMessage._id,
    content: newMessage.content,
    timestamp: newMessage.timestamp,
    senderName: sender.name
  };
  await chat.save();
  
  res.status(201).json(newMessage);
}

const createChat = async (req, res) => {
  const { users, name, isGroupChat } = req.body;

  const chat = await Chat.create({
    users,
    groupName: name,
    admin: users[0],
    messages: [],
    isGroupChat,
    pendingApprovals: isGroupChat ? users.slice(1) : []
  });

  res.status(201).json(chat);
}

const updateGroupChat = async (req, res) => {
  const { chatId, name, users, admin } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  if (chat.admin.toString() !== admin) {
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

  chat.pendingApprovals = chat.pendingApprovals.filter(id => id.toString() !== userId);
  chat.users.push(userId);

  await chat.save();

  res.status(200).json(chat);
}

const messageChangeStream = Message.watch();
messageChangeStream.on('change', async (change) => {
  if(change.operationType !== 'insert') return;

  const message = await Message.findById(change.fullDocument._id);

  const chat = await Chat.findById(message.chat);
  chat.lastMessage = message;
  await chat.save();
  
  chat.users.forEach(userId => {
    emitToConnectedClient(userId.toString(), 'message', message);
  });
});

const chatChangeStream = Chat.watch();
chatChangeStream.on('change', async (change) => {
  const chat = await Chat.findById(change.documentKey._id);
  const lastMessage = await Message.findById(chat.messages[chat.messages.length - 1]);
  const changedChat = {
    _id: chat._id,
    users: chat.users,
    lastMessage
  };

  chat.users.forEach(userId => {
    emitToConnectedClient(userId.toString(), 'chat', changedChat);
  });
});

export { getMessages, saveMessage, getChats, createChat, updateGroupChat, approveGroupChatRequest };