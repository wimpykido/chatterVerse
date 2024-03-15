import { Box, Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ChangeAvatar } from "../avatar_change-modal";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { AuthContext, AuthContextProps } from "../../context/authContext";

export const BackgroundImageComp = () => {
  const [change, setChange] = useState(false);
  const [open, setOpen] = useState(false);
  const [coverURL, setCoverURL] = useState<string | null>(null);

  const { user } = useContext(AuthContext) as AuthContextProps;
  useEffect(() => {
    const fetchCoverURL = async () => {
      try {
        const storageRef = ref(
          storage,
          `covers/${user!.uid}/cover-${user!.uid}`
        );
        const downloadURL = await getDownloadURL(storageRef);
        setCoverURL(downloadURL);
        setChange(false);
      } catch (error) {
        console.error("Error fetching cover:", error);
        setCoverURL(null);
      }
    };

    fetchCoverURL();
  }, [user]);

  return (
    <Box
      position={"relative"}
      width={"100%"}
      height={"200px"}
      bgcolor={!coverURL ? "#380000" : "transparent"}
      onMouseEnter={() => setChange(true)}
      onMouseLeave={() => setChange(false)}
      style={{
        backgroundImage: `url(${coverURL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {change && (
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bgcolor="rgba(0, 0, 0, 0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            variant="text"
            color="secondary"
            sx={{ color: "white" }}
            onClick={() => setOpen(true)}
          >
            Change Cover
          </Button>
        </Box>
      )}
      <ChangeAvatar
        setChange={setChange}
        type="Cover"
        open={open}
        setOpen={setOpen}
        setCoverURL={setCoverURL}
      />
    </Box>
  );
};
