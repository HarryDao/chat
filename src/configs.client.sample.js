module.exports = {
  SERVER_URL: '',
  SOCKET: {
    authenticate: 'authenticate',
    authenticated: 'authenticated',
    authenticateFailed: 'authenticated_failed',
    unauthorized: 'unauthorized',
    activeUsers: 'active-users',
    newUser: 'new-user',
    newMessage: 'new-message',
    isTyping: 'is-typing',
    friendIsTyping: 'friend-is-typing'
  },
  MESSAGE: {
    MAX_INACTIVE_TIME_IN_SECONDS: 60
  },
  TYPING_WAITING_TIME_IN_SECONDS: 3
}