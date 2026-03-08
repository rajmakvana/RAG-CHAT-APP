import api from './api';

const ChatService = {
  getThreads: async () => {
    const response = await api.get('/api/v1/chat/threads');
    return response.data;
  },

  getThreadMessages: async (threadId) => {
    const response = await api.get(`/api/v1/chat/threads/${threadId}`);
    return response.data;
  },

  sendMessage: async (question, threadId) => {
    const response = await api.post('/api/v1/chat/message', { question, threadId });
    return response.data;
  },

  deleteThread: async (threadId) => {
    const response = await api.delete(`/api/v1/chat/threads/${threadId}`);
    return response.data;
  }
};

export default ChatService;
