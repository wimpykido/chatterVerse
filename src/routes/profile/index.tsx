import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { useContext, useEffect, useState } from "react";
import { AuthContext, AuthContextProps } from "../../context/authContext";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { UserDetail } from "../../components/user-detail";
import avatar from "../../assets/9.png";
import { UnauthLayout } from "../../components/templates/unauth";
import EditIcon from "@mui/icons-material/Edit";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ChangeAvatar } from "../../components/avatar_change-modal";

export enum DetailType {
  DISPLAYNAME = "display name",
  BIO = "bio",
  PHONENUMBER = "phone number",
  EMAIL = "email",
}

const Profile = () => {
  const [, setLoading] = useState(false);
  const [change, setChange] = useState(false);
  const [userBio, setUserBio] = useState("");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext) as AuthContextProps;
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/sign-in");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const editDisplayName = async (editedValue: string) => {
    if (!user) {
      return;
    }
    setLoading(true);

    try {
      await updateProfile(user, {
        displayName: editedValue,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const editEmail = async (editedValue: string, currentPassword: string) => {
    if (!user) {
      return;
    }
    setLoading(true);
    try {
      await updateEmail(user, editedValue);

      await sendEmailVerification(user);

      const credentials = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      await reauthenticateWithCredential(user, credentials);
    } catch (error) {
      console.error("Error updating email:", error);
    } finally {
      setLoading(false);
    }
  };

  const editBio = async (editedValue: string) => {
    if (!user) {
      return;
    }
    setLoading(true);
    try {
      const userDocRef = doc(db, "users", user!.uid);
      console.log(user!.uid);
      await updateDoc(userDocRef, {
        bio: editedValue,
      });
      setUserBio(editedValue);
    } catch (error) {
      console.error("Error updating bio in Firestore:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBioFromFirestore = async () => {
    try {
      const userDocRef = doc(db, "users", user!.uid);

      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const bio = userData.bio || "No bio available";
        return bio;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting bio from Firestore:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserBio = async () => {
      const bio = await getBioFromFirestore();
      setUserBio(bio);
    };

    fetchUserBio();
  }, [userBio]);

  return (
    <UnauthLayout>
      <Box width={"60%"} p={3}>
        <Typography variant="h2" fontSize={"24px"} marginBottom={3}>
          My Account
        </Typography>
        <Box p={2} bgcolor={theme.palette.info.main} borderRadius={2}>
          <Box gap={2} marginBottom={2} display={"flex"} alignItems={"center"}>
            <Box display={"flex"} alignItems={"center"}>
              <Avatar
                src={user?.photoURL ? user?.photoURL : avatar}
                sx={{ width: "80px", height: "80px", position: "relative" }}
                onMouseEnter={() => setChange(true)}
                onMouseLeave={() => setChange(false)}
              />
              {change && (
                <IconButton
                  onMouseEnter={() => setChange(true)}
                  onMouseLeave={() => setChange(false)}
                  onClick={() => setOpen(true)}
                  style={{
                    position: "absolute",
                    transform: "translate(50%, 0)",
                  }}
                >
                  <EditIcon style={{ color: "white" }} />
                </IconButton>
              )}
              <ChangeAvatar open={open} setOpen={setOpen} />
            </Box>
            <Box
              width={"100%"}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              {" "}
              <Typography>
                {user!.displayName ? user!.displayName : user!.email}
              </Typography>
              <Button
                variant="contained"
                onClick={handleLogout}
                sx={{
                  border: "1px solid #5865f2",
                  textTransform: "none",
                  backgroundColor: "#5865f2",
                  color: "white",
                  fontWeight: 400,
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                    backgroundColor: "#4752c4",
                    border: "1px solid #4752c4",
                  },
                  fontSize: 14,
                }}
              >
                Log out
              </Button>
            </Box>
          </Box>
          <Box
            borderRadius={2}
            p={2}
            bgcolor={theme.palette.info.light}
            gap={3}
            flexDirection={"column"}
            display={"flex"}
          >
            <UserDetail
              editDisplayName={editDisplayName}
              detailType={DetailType.DISPLAYNAME}
              userDetail={user!.displayName}
            />
            <UserDetail
              detailType={DetailType.EMAIL}
              userDetail={user!.email}
              editEmail={editEmail}
            />
            <UserDetail
              detailType={DetailType.BIO}
              userDetail={userBio}
              editBio={editBio}
            />
            <UserDetail
              detailType={DetailType.PHONENUMBER}
              userDetail={user!.phoneNumber}
            />
          </Box>
        </Box>
      </Box>
    </UnauthLayout>
  );
};

export default Profile;
