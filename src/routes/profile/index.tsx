import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { useContext, useEffect, useState } from "react";
import { AuthContext, AuthContextProps } from "../../context/authContext";
import {
  Avatar,
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Skeleton,
  Switch,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { UserDetail } from "../../components/user-detail";
import avatar from "../../assets/5.png";
import EditIcon from "@mui/icons-material/Edit";
import { BackgroundImageComp } from "../../components/background-image";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ChangeAvatar } from "../../components/avatar_change-modal";
import { ThemeContext, ThemeContextType } from "../../context/theme-provider";
import { ResetPassword } from "../../components/reset-password";
import { DeleteAccount } from "../../components/delete-account";
import { AuthLayout } from "../../components/templates/auth";

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
  const [checked, setChecked] = useState(true);

  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext) as AuthContextProps;
  const theme = useTheme();
  const { toggleDarkMode } = useContext(ThemeContext) as ThemeContextType;

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
      const userDocRef = doc(db, "users", user.uid);

      await updateDoc(userDocRef, {
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

    try {
      const userDocRef = doc(db, "users", user.uid);

      await updateDoc(userDocRef, {
        bio: editedValue,
      });
      setUserBio(editedValue);
    } catch (error) {
      console.error("Error updating bio in Firestore:", error);
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

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
      width: 32,
      height: 32,
      "&::before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      borderRadius: 20 / 2,
    },
  }));

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AuthLayout>
      <Box
        height={"100%"}
        p={isSmallScreen ? 3 : 5}
        alignSelf={"center"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"flex-start"}
        justifyContent={"space-between"}
        sx={{
          width: "100%",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: { xs: "1px", md: "4px" },
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.secondary.light,
            borderRadius: "5px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#333",
          },
        }}
      >
        <Box
          width={"100%"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          alignContent={"center"}
        >
          <Typography variant="h2" fontSize={"24px"}>
            My Account
          </Typography>
          <FormControlLabel
            control={<MaterialUISwitch sx={{ m: 1 }} checked={checked} />}
            onChange={() => {
              toggleDarkMode();
              setChecked(!checked);
            }}
            label={"switch theme"}
          />
        </Box>
        <Box width={"100%"} bgcolor={theme.palette.info.main} borderRadius={2}>
          <Box
            gap={3}
            display={"flex"}
            alignItems={"center"}
            position={"relative"}
          >
            <BackgroundImageComp />
            <Box
              paddingX={2}
              width={"100%"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              position={"absolute"}
              sx={{
                zIndex: 1,
                transform: "translate(0, 100%)",
              }}
            >
              <Box display={"flex"} alignItems={"center"}>
                <Box
                  bgcolor={theme.palette.info.main}
                  borderRadius={"50%"}
                  p={1}
                >
                  {loading ? ( // Skeleton for Avatar when loading
                    <Skeleton variant="circular" width={100} height={100} />
                  ) : (
                    <>
                      <Avatar
                        src={user?.photoURL ? user?.photoURL : avatar}
                        sx={{
                          width: "100px",
                          height: "100px",
                          position: "relative",
                        }}
                        onMouseEnter={() => setChange(true)}
                        onMouseLeave={() => setChange(false)}
                      />

                      {change && (
                        <IconButton
                          onMouseEnter={() => setChange(true)}
                          onMouseLeave={() => setChange(false)}
                          onClick={() => setOpen(true)}
                          style={{
                            width: "100px",
                            height: "100px",
                            position: "absolute",
                            transform: "translate(0, -100%)",
                          }}
                        >
                          <EditIcon style={{ color: "white" }} />
                        </IconButton>
                      )}
                    </>
                  )}
                </Box>
                <ChangeAvatar type="Avatar" open={open} setOpen={setOpen} />
              </Box>
              <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                {" "}
                <Typography>
                  {loading ? (
                    <Skeleton variant="text" width={150} />
                  ) : user!.displayName ? (
                    user!.displayName
                  ) : (
                    user!.email
                  )}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  sx={{
                    display: "none",
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
                  {loading ? <Skeleton variant="text" width={80} /> : "Log out"}
                </Button>
              </Box>
            </Box>
          </Box>
          <Box
            margin={2}
            borderRadius={2}
            p={isSmallScreen ? 0 : 3}
            bgcolor={isSmallScreen ? "" : theme.palette.info.light}
            gap={2}
            flexDirection={"column"}
            display={"flex"}
            marginTop={10}
          >
            <UserDetail
              editDisplayName={editDisplayName}
              detailType={DetailType.DISPLAYNAME}
              userDetail={loading ? "" : user!.displayName}
            />
            <UserDetail
              detailType={DetailType.EMAIL}
              userDetail={loading ? "" : user!.email}
              editEmail={editEmail}
            />
            <UserDetail
              detailType={DetailType.BIO}
              userDetail={loading ? "" : userBio}
              editBio={editBio}
            />
            <UserDetail
              detailType={DetailType.PHONENUMBER}
              userDetail={loading ? "" : user!.phoneNumber}
            />
          </Box>
        </Box>
        <Box
          width={"100%"}
          marginTop={2}
          display={"flex"}
          gap={2}
          flexDirection={isSmallScreen ? "column" : "row"}
          justifyContent={"space-between"}
          alignItems={isSmallScreen ? "flex-start" : "center"}
        >
          <ResetPassword />
          <DeleteAccount />
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default Profile;
