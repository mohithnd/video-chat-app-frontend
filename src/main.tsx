import "./index.css";

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { SocketProvider } from "./Context/SocketContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <SocketProvider>
      <App />
    </SocketProvider>
  </BrowserRouter>
);
