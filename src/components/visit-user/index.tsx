import {
  Stack,
  Box,
  Avatar,
  useTheme,
  Typography,
  Button,
  Divider,
  Slide,
  Skeleton,
  useMediaQuery,
  Drawer,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  open: boolean;
  setUserInfoOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserInfo = ({ user, open, setUserInfoOpen }: Props) => {
  const theme = useTheme();
  const isSmaller = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = () => {
    setUserInfoOpen(false);
  };

  const renderContent = () => {
    if (!user) {
      return (
        <>
          <Skeleton variant="rectangular" width="100%" height={150} />
          <Box
            margin={2}
            bgcolor={theme.palette.info.main}
            borderRadius={"50%"}
            p={1}
            position={"absolute"}
            zIndex={1}
            sx={{
              transform: "translate(0, 70%)",
            }}
          >
            <Skeleton variant="circular" width={100} height={100} />
          </Box>
          <Box height={"100px"}></Box>
          <Box
            margin={2}
            borderRadius={2}
            p={2}
            position="relative"
            bgcolor={theme.palette.info.dark}
          >
            <Skeleton variant="text" width="50%" />
            <Divider sx={{ marginY: 2 }} />
            <Skeleton variant="text" width="70%" />
            <Divider sx={{ marginY: 2 }} />
            <Skeleton variant="text" width="80%" />
          </Box>
          <Box
            margin={2}
            borderRadius={2}
            p={2}
            bgcolor={theme.palette.info.dark}
          >
            <Skeleton variant="text" width="50%" />
          </Box>
        </>
      );
    }

    return (
      <>
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
      </>
    );
  };

  if (isSmaller) {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        variant="temporary"
        sx={{
          "& .MuiDrawer-paper": {
            width: "100%",
          },
        }}
      >
        <Stack width="100%" bgcolor={theme.palette.info.main} height="100%">
          {renderContent()}
          <IconButton
            color="primary"
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", top: 0, right: 0 }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </Drawer>
    );
  }

  return (
    <Slide in={open} direction="left" mountOnEnter unmountOnExit>
      <Stack width="450px" bgcolor={theme.palette.info.main} height="100%">
        {renderContent()}
        <IconButton
          color="primary"
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", top: 0, right: 0 }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
    </Slide>
  );
};
