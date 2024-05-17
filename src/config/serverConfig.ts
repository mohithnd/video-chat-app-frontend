export default {
  VITE_WS_SERVER: import.meta.env.VITE_WS_SERVER || "http://localhost:3000",
  VITE_PEER_SERVER_HOST: import.meta.env.VITE_PEER_SERVER_HOST || "localhost",
  VITE_PEER_SERVER_PORT: import.meta.env.VITE_PEER_SERVER_PORT || 9000,
  VITE_PEER_SERVER_PATH: import.meta.env.VITE_PEER_SERVER_PATH || "/video-chat",
};
