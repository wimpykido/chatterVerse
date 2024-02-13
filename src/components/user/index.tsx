import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import { DocumentData } from "firebase/firestore";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import MoreVertIcon from "@mui/icons-material/MoreVert";

type Props = {
  user: DocumentData;
};

export const UserListItem = ({ user }: Props) => {
  return (
    <ListItem sx={{ width: "100%", paddingLeft: 0, paddingRight: 0 }}>
      <ListItemButton
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
          <Typography>
            {user.displayName ? user.displayName : user.email}
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
