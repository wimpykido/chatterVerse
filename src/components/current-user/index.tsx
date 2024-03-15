import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, AuthContextProps } from "../../context/authContext";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import avatar from "../../assets/5.png";

export const CurrentUser = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) as AuthContextProps;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  return isSmallScreen ? (
    <IconButton onClick={() => navigate("/profile")}>
      <Avatar src={user?.photoURL ? user?.photoURL : ""} />
    </IconButton>
  ) : (
    <Button
      sx={{
        textAlign: "left",
        justifyContent: "flex-start",
      }}
      fullWidth
      variant="text"
      color="secondary"
      onClick={() => navigate("/profile")}
      startIcon={<Avatar src={user?.photoURL ? user?.photoURL : avatar} />}
    >
      <Typography textAlign={"left"} textTransform={"none"}>
        {user?.displayName ? user.displayName : user?.email}
      </Typography>
    </Button>
  );
};
