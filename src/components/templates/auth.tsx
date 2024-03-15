import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import { CurrentUser } from "../current-user";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { ProblemReport } from "../report-problem";
import LogoutIcon from "@mui/icons-material/Logout";

type Props = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: Props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      bgcolor={theme.palette.secondary.light}
      height={"100vh"}
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Stack
        height={"100%"}
        bgcolor={theme.palette.info.main}
        width={isSmallScreen ? "80px" : "30%"}
        maxWidth={"500px"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"flex-start"}
        justifyContent={"space-between"}
        gap={2}
        overflow={isSmallScreen ? "auto" : "none"}
      >
        <Box
          width={"100%"}
          p={3}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          gap={2}
        >
          {isSmallScreen ? null : (
            <Typography
              alignSelf={"center"}
              marginBottom={2}
              textAlign={"center"}
              variant="h2"
              fontSize={"24px"}
              textTransform={"uppercase"}
              style={{ letterSpacing: "4px" }}
            >
              ChatterVerse
            </Typography>
          )}

          <CurrentUser />
          {isSmallScreen ? (
            <>
              <IconButton onClick={() => navigate("/chats")}>
                <ChatIcon />
              </IconButton>
              <IconButton onClick={() => navigate("/search")}>
                <SearchIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Button
                onClick={() => navigate("/chats")}
                fullWidth
                startIcon={<ChatIcon />}
                sx={{
                  textAlign: "left",
                  justifyContent: "flex-start",
                  color: theme.palette.primary.contrastText,
                }}
              >
                <Typography textTransform={"none"} sx={{ textAlign: "left" }}>
                  Chats
                </Typography>
              </Button>
              <Button
                fullWidth
                onClick={() => navigate("/search")}
                startIcon={<SearchIcon />}
                sx={{
                  textAlign: "left",
                  justifyContent: "flex-start",
                  color: theme.palette.primary.contrastText,
                }}
              >
                <Typography textTransform={"none"} sx={{ textAlign: "left" }}>
                  Search
                </Typography>
              </Button>
            </>
          )}
        </Box>
        <Box
          p={isSmallScreen ? 0 : 3}
          width={"100%"}
          display={"flex"}
          alignItems={"center"}
          flexDirection={"column"}
          justifyContent={"center"}
        >
          {isSmallScreen ? (
            <IconButton
              onClick={async () => {
                await auth.signOut();
                navigate("/sign-in");
              }}
            >
              <LogoutIcon />
            </IconButton>
          ) : (
            <Button
              fullWidth
              color="secondary"
              variant="outlined"
              onClick={async () => {
                await auth.signOut();
                navigate("/sign-in");
              }}
            >
              Log Out
            </Button>
          )}
          <ProblemReport />
        </Box>
      </Stack>
      {children}
    </Box>
  );
};
