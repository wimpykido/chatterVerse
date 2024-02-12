import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { CurrentUser } from "../current-user";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export const AuthLayout = ({ children }: Props) => {
  const navigate = useNavigate();
  const theme = useTheme();
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
        width={"25%"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"flex-start"}
        justifyContent={"space-between"}
        gap={2}
      >
        <Box
          width={"100%"}
          p={3}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          gap={2}
        >
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
          <CurrentUser />
          <Button
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
        </Box>
        <Box p={3} width={"100%"}>
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
          <Button
            variant="text"
            fullWidth
            startIcon={<ReportProblemIcon />}
            sx={{
              textAlign: "left",
              justifyContent: "flex-start",
              marginTop: 1,
              color: "#A0A0A0",
            }}
          >
            <Typography
              fontSize={"14px"}
              textTransform={"none"}
              sx={{ textAlign: "left" }}
            >
              Report a Problem
            </Typography>
          </Button>
        </Box>
      </Stack>
      {children}
    </Box>
  );
};
