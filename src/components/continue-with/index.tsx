import { Box, IconButton } from "@mui/material";
import google from "../../assets/google.png";
import facebook from "../../assets/facebook.png";
import { AuthContext, AuthContextProps } from "../../context/authContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { User } from "firebase/auth";

const ContinueWith = () => {
  const { googleSignIn, facebookSignIn, user } = useContext(
    AuthContext
  ) as AuthContextProps;
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const signedInUser = await googleSignIn();
      if (signedInUser !== null && signedInUser !== undefined) {
        console.log("hi");
      } else {
        console.log("Google sign-in failed.");
      }
      console.log("hi2");
    } catch (error) {
      console.log(error);
    }
  };
  const updateUserProfile = async (newUser: User) => {
    try {
      await setDoc(doc(db, "users", newUser.uid), {
        photoURL: newUser.photoURL || "",
        coverURL: "",
        email: newUser.email || "",
        id: newUser.uid,
        displayName: newUser.displayName || "",
        phoneNumber: newUser.phoneNumber || "",
        emailVerified: newUser.emailVerified,
        bio: "",
      });
      console.log("Document successfully written!");
    } catch (error) {
      console.error("Error writing document:", error);
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
    const fetchData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userDocSnapshot1 = await getDoc(doc(db, "userChats", user.uid));
        if (!userDocSnapshot.exists()) {
          await updateUserProfile(user);
        }
        if (!userDocSnapshot1.exists()) {
          await setDoc(doc(db, "userChats", user.uid), {});
        }
        navigate("/profile");
      }
    };

    fetchData();
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
