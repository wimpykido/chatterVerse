import { Box, Stack, Typography, Avatar, useTheme } from "@mui/material";
import { useContext } from "react";
import { MessageType } from "../../routes/chat-room";
import { AuthContext, AuthContextProps } from "../../context/authContext";
import { DocumentData } from "firebase/firestore";

type Props = {
  message: DocumentData;
};

const Sent = ({ message }: Props) => {
  const { user } = useContext(AuthContext) as AuthContextProps;

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const theme = useTheme();

  return (
    <Box marginRight={4} display={"flex"} gap={1} alignSelf={"flex-end"}>
      <Stack
        display={"flex"}
        alignItems={"flex-end"}
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
            bgcolor={"#615EF0"}
            width={"fit-content"}
            p={1.5}
            borderRadius={"10px"}
            sx={{ borderTopRightRadius: "0" }}
          >
            <Typography fontSize={"14px"} color={"white"}>
              {message.content}
            </Typography>
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
      <Avatar src={user?.photoURL ? user?.photoURL : ""} />
    </Box>
  );
};

export default Sent;
