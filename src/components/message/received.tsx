import { Box, Stack, Typography, Avatar, useTheme } from "@mui/material";
import { MessageType } from "../../routes/chat-room";
import { DocumentData } from "firebase/firestore";

type Props = {
  message: DocumentData;
  user: DocumentData;
};

const Received = ({ message, user }: Props) => {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const theme = useTheme();

  return (
    <Box marginLeft={4} display={"flex"} gap={1} alignSelf={"flex-start"}>
      <Avatar src={user?.photoURL ? user?.photoURL : ""} />
      <Stack
        display={"flex"}
        alignItems={"flex-start"}
        justifyContent={"center"}
        gap={1}
      >
        <Typography
          fontSize={"12px"}
          color={theme.palette.primary.contrastText}
        >
          {user!.displayName}
        </Typography>
        {message.type === MessageType.Text ? (
          <Box
            bgcolor={theme.palette.info.contrastText}
            width={"fit-content"}
            p={1.5}
            borderRadius={"10px"}
            sx={{ borderTopLeftRadius: "0" }}
          >
            <Typography fontSize={"14px"}>{message.content}</Typography>
          </Box>
        ) : message.type === MessageType.Image ? (
          <img
            src={message.content}
            alt="Sent Image"
            style={{ maxWidth: "300px" }}
          />
        ) : message.type === MessageType.Video ? (
          <video src={message.content} controls style={{ maxWidth: "300px" }} />
        ) : null}
        <Typography fontSize={"10px"} color={"#A0A0A0"}>
          {formatTimestamp(message.timestamp)}
        </Typography>
      </Stack>
    </Box>
  );
};

export default Received;
