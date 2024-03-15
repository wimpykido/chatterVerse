import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import {
  DocumentData,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useContext } from "react";
import { AuthContext, AuthContextProps } from "../../context/authContext";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

type Props = {
  otherUser: DocumentData;
};

export const UserListItem = ({ otherUser }: Props) => {
  const { user } = useContext(AuthContext) as AuthContextProps;

  const navigate = useNavigate();

  const handleSelect = async () => {
    console.log("current:", user);
    console.log(otherUser);
    if (user) {
      const combinedId =
        user.uid > otherUser.id
          ? `${user.uid}_${otherUser.id}`
          : `${otherUser.id}_${user.uid}`;

      try {
        const chatRef = doc(db, "chats", combinedId);
        const chatSnap = await getDoc(chatRef);
        if (!chatSnap.exists()) {
          await setDoc(doc(db, "chats", combinedId), { messages: [] });
          await updateDoc(doc(db, "userChats", user.uid), {
            [combinedId + ".userInfo"]: {
              id: otherUser!.id,
            },
            [combinedId + ".lastMessage"]: {},
            [combinedId + ".date"]: serverTimestamp(),
          });
          await updateDoc(doc(db, "userChats", otherUser.id), {
            [combinedId + ".userInfo"]: {
              id: user!.uid,
            },
            [combinedId + ".lastMessage"]: {},
            [combinedId + ".date"]: serverTimestamp(),
          });
          await navigate(`/chats/${combinedId}/${otherUser.id}`);
        } else {
          console.log("arsebobs");
        }
      } catch (err) {
        console.log({ "errori gakvs": err });
      }
    }
  };
  return (
    <ListItem sx={{ width: "100%", paddingLeft: 0, paddingRight: 0 }}>
      <ListItemButton
        onClick={handleSelect}
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
          <Avatar src={otherUser.photoURL} />
          <Typography>
            {otherUser.displayName ? otherUser.displayName : otherUser.email}
          </Typography>
        </Box>
        <Box>
          <IconButton>
            <ChatBubbleIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </ListItemButton>
    </ListItem>
  );
};
