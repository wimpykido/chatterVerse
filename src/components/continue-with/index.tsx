import { Box, IconButton } from "@mui/material";
import google from "../../assets/google.png";
import facebook from "../../assets/facebook.png";
import { AuthContext, AuthContextProps } from "../../context/authContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ContinueWith = () => {
  const { googleSignIn, facebookSignIn, user } = useContext(
    AuthContext
  ) as AuthContextProps;
  const navigate = useNavigate();
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };
  const handleFacebookSignIn = async () => {
    try {
      await facebookSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);
  return (
    <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
      <IconButton onClick={handleGoogleSignIn}>
        <img width={"32px"} height={"32px"} src={google} alt="Icon 1" />
      </IconButton>
      <IconButton onClick={handleFacebookSignIn}>
        <img width={"32px"} height={"32px"} src={facebook} alt="Icon 2" />
      </IconButton>
    </Box>
  );
};

export default ContinueWith;
