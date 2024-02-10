import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { useContext } from "react";
import { AuthContext, AuthContextProps } from "../../context/authContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) as AuthContextProps;
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/sign-in");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <div>
      <>{user!.email}</>
      <>{user!.displayName}</>
      <button onClick={handleLogout}>log out</button>
    </div>
  );
};

export default Profile;
