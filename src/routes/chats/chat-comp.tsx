import {
  Avatar,
  Box,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/material";
import { DocumentData } from "firebase/firestore";
import { Chat } from "../../context/chat-context";
import { useNavigate } from "react-router-dom";

type Props = {
  user: DocumentData;
  chat: Chat;
  handleSelect: () => Promise<void>;
};

const ChatComp = ({ user, chat, handleSelect }: Props) => {
  const navigate = useNavigate();
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleClick = async () => {
    await navigate(`/chats/${chat.chatId}/${user.id}`);
    handleSelect();
  };

  console.log("chat", chat);

  return (
    <ListItem sx={{ width: "100%", paddingLeft: 0, paddingRight: 0 }}>
      <ListItemButton
        onClick={handleClick}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          gap={1}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Avatar src={user.photoURL} />
          <Stack
            display={"flex"}
            justifyContent={"center"}
            alignItems={"flex-start"}
            flexDirection={"column"}
          >
            <Typography>
              {user.displayName ? user.displayName : user.email}
            </Typography>
            {chat.lastMessage.content && (
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={1}
              >
                <Typography variant="body2" fontSize={"10px"}>
                  {chat.lastMessage.senderId !== user.id && " you: "}
                  {chat.lastMessage.type === "text"
                    ? chat.lastMessage.content
                    : chat.lastMessage.type === "image"
                    ? "sent a photo"
                    : chat.lastMessage.type === "video"
                    ? "sent a video"
                    : ""}
                </Typography>
                <Typography variant="body2" fontSize={"10px"}>
                  {formatTimestamp(chat.createdAt)}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </ListItemButton>
    </ListItem>
  );
};

export default ChatComp;
