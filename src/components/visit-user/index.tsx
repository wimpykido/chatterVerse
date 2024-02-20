import {
  Stack,
  Box,
  Avatar,
  useTheme,
  Typography,
  Button,
  Divider,
  Slide,
} from "@mui/material";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  open: boolean;
};

export const UserInfo = ({ user, open }: Props) => {
  const theme = useTheme();

  return (
    <Slide in={open} direction="left" mountOnEnter unmountOnExit>
      <Stack
        width={"450px"}
        bgcolor={theme.palette.info.main}
        height={"100%"}
        //   borderLeft={`1px solid ${theme.palette.info.main}`}
      >
        <Box position={"relative"}>
          <Box
            position={"relative"}
            width={"100%"}
            height={"150px"}
            bgcolor={!user.coverURL ? "#380000" : "transparent"}
            style={{
              backgroundImage: `url(${user.coverURL})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></Box>
          <Box
            margin={2}
            bgcolor={theme.palette.info.main}
            borderRadius={"50%"}
            p={1}
            position={"absolute"}
            zIndex={1}
            sx={{
              transform: "translate(0, -50%)",
            }}
          >
            <Avatar
              src={user.photoURL}
              sx={{
                width: "100px",
                height: "100px",
              }}
            />
          </Box>
        </Box>
        <Box height={"100px"}></Box>
        <Box
          margin={2}
          borderRadius={2}
          p={2}
          position="relative"
          bgcolor={theme.palette.info.dark}
        >
          <Typography>
            {user.displayName ? user.displayName : user.email}
          </Typography>
          <Divider sx={{ marginY: 2 }} />
          <Typography>{user.email}</Typography>
          <Divider sx={{ marginY: 2 }} />
          <Typography>{user.bio}</Typography>
        </Box>
        <Box
          margin={2}
          borderRadius={2}
          p={2}
          bgcolor={theme.palette.info.dark}
        >
          <Button fullWidth variant="text">
            <Typography
              textTransform={"none"}
              color={theme.palette.primary.contrastText}
            >
              Block user
            </Typography>
          </Button>
        </Box>
      </Stack>
    </Slide>
  );
};
