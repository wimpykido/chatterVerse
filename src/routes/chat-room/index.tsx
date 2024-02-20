import { useParams } from "react-router-dom";
import { AuthLayout } from "../../components/templates/auth";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { UserInfo } from "../../components/visit-user";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { MessageInput } from "../../components/message-input";

const ChatRoom = () => {
  const [isUserInfoOpen, setUserInfoOpen] = useState(false);
  const { serializedUser } = useParams();

  const user = JSON.parse(serializedUser!);
  const theme = useTheme();

  const handleUserInfoToggle = () => {
    setUserInfoOpen(!isUserInfoOpen);
  };

  return (
    <AuthLayout>
      <Box
        width={"80%"}
        height={"100%"}
        display={"flex"}
        justifyContent={"center"}
        overflow={"hidden"}
      >
        <Box
          width={"100%"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <AppBar position="static">
            <Toolbar
              sx={{
                backgroundColor: theme.palette.info.main,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Avatar src={user.photoURL} />
                <Typography ml={1} variant="h6">
                  {user.displayName ? user.displayName : user.email}
                </Typography>
              </Box>
              <IconButton color="inherit" onClick={handleUserInfoToggle}>
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box width={"100%"} p={2}>
            <MessageInput />
          </Box>
        </Box>
        <UserInfo user={user} open={isUserInfoOpen} />
      </Box>
    </AuthLayout>
  );
};
export default ChatRoom;
