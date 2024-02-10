import { ReactNode, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
};
const Protected = ({ children }: Props) => {
  const user = useContext(AuthContext);
  return !user ? <Navigate to="sign-in" replace /> : children;
};

export default Protected;
