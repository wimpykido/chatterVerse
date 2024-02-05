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
    element: <Profile />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
