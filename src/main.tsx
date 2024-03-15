import React from "react";
import ReactDOM from "react-dom/client";
import ThemeProvider from "./context/theme-provider.tsx";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import SignIn from "./routes/sign-in/index.tsx";
import SignUp from "./routes/sign-up/index.tsx";
import Profile from "./routes/profile/index.tsx";
import { AuthProvider } from "./context/authContext.tsx";
import Protected from "./routes/protected/index.tsx";
import Search from "./routes/search/index.tsx";
import { ErrorBoundary } from "react-error-boundary";
import Chats from "./routes/chats/index.tsx";
import { ChatContextProvider } from "./context/chat-context.tsx";
import ChatRoom from "./routes/chat-room/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/sign-in" />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/profile",
    element: (
      <Protected>
        <Profile />
      </Protected>
    ),
  },
  {
    path: "/search",
    element: (
      <Protected>
        <Search />
      </Protected>
    ),
  },
  {
    path: "/chats",
    element: (
      <ChatContextProvider>
        <Protected>
          <Chats />
        </Protected>
      </ChatContextProvider>
    ),
  },
  {
    path: "chats/:chatId/:userId",
    element: (
      <ChatContextProvider>
        <Protected>
          <ChatRoom />
        </Protected>
      </ChatContextProvider>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <AuthProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
