import { Box, Button, Modal, Typography, useTheme } from "@mui/material";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useContext, useRef } from "react";
import { AuthContext, AuthContextProps } from "../../context/authContext";
import { updateProfile } from "firebase/auth";
import { storage } from "../../firebase";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const ChangeAvatar = ({ open, setOpen }: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useContext(AuthContext) as AuthContextProps;
  const theme = useTheme();

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      try {
        const storageRef = ref(
          storage,
          `avatars/${user!.uid}/${selectedFile.name}`
        );
        const metadata = {
          customMetadata: {
            uid: user!.uid,
          },
        };
        await uploadBytes(storageRef, selectedFile, metadata);

        const downloadURL = await getDownloadURL(storageRef);

        await updateProfile(user!, {
          photoURL: downloadURL,
        });
        console.log("Image URL stored in Firestore:", downloadURL);

        setOpen(false);
      } catch (error) {
        console.error("Error updating avatar:", error);
      }
    }
  };
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="editing-modal"
      aria-describedby="modal-to-edit-avatar"
    >
      <Box sx={style}>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button variant="outlined" fullWidth onClick={handleButtonClick}>
          <Typography
            textTransform={"none"}
            color={theme.palette.primary.contrastText}
            variant="body1"
          >
            Change Avatar
          </Typography>
        </Button>
        <Button
          fullWidth
          color="error"
          onClick={() => console.log("Delete Avatar")}
        >
          <Typography textTransform={"none"} variant="body1">
            Delete Avatar
          </Typography>
        </Button>
      </Box>
    </Modal>
  );
};
