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
  Skeleton,
  Stack,
} from "@mui/material";
import { UserInfo } from "../../components/visit-user";
import MenuIcon from "@mui/icons-material/Menu";
import { useContext, useEffect, useState } from "react";
import { MessageInput } from "../../components/message-input";
import { ChatContext, ChatContextType } from "../../context/chat-context";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import Message from "../../components/message";

export enum MessageType {
  Text = "text",
  Image = "image",
  Video = "video",
}

export type Message = {
  type: MessageType;
  content: string;
  senderId: string;
  timestamp: number;
};

const ChatRoom = () => {
  const [user, setUser] = useState<DocumentData | undefined>();
  const [isUserInfoOpen, setUserInfoOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const { userId, chatId } = useParams();

  const { getUserById } = useContext(ChatContext) as ChatContextType;

  const theme = useTheme();

  const handleUserInfoToggle = () => {
    setUserInfoOpen(!isUserInfoOpen);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userId) {
          const userData = await getUserById(userId);
          setUser(userData);
          console.log(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId, getUserById]);

  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(doc(db, "chats", chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });
      return () => {
        unSub();
      };
    }
  }, [chatId]);

  return (
    <AuthLayout>
      <Box
        width={"100%"}
        height={"100%"}
        display={"flex"}
        justifyContent={"center"}
        overflow={"hidden"}
        alignSelf={"center"}
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
                {user ? (
                  <>
                    <Avatar src={user.photoURL} />
                    <Typography ml={1} variant="h6">
                      {user.displayName ? user.displayName : user.email}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width={150} height={20} />
                  </>
                )}
              </Box>
              <IconButton color="inherit" onClick={handleUserInfoToggle}>
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Stack
            marginTop={1}
            height={"100%"}
            gap={3}
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
            {messages.map((mes: Message, key) => {
              return mes.senderId === user!.id ? (
                <Message key={key} otherUser={user} message={mes} />
              ) : (
                <Message key={key} message={mes} />
              );
            })}
          </Stack>
          <Box width={"100%"} p={2}>
            <MessageInput chatId={chatId!} userId={userId!} />
          </Box>
        </Box>
        {user && (
          <UserInfo
            setUserInfoOpen={setUserInfoOpen}
            user={user}
            open={isUserInfoOpen}
          />
        )}
      </Box>
    </AuthLayout>
  );
};

export default ChatRoom;
