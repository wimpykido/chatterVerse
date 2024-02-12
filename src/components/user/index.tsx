import { Avatar, Box, Typography } from "@mui/material";
import { DocumentData } from "firebase/firestore";

type Props = {
  user: DocumentData;
};

export const UserListItem = ({ user }: Props) => {
  return (
    <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
      <Avatar src={user.photoURL} />
      <Typography>
        {user.displayName ? user.displayName : user.email}
      </Typography>
    </Box>
  );
};
