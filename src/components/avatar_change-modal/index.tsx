import { Box, Button, Modal, Typography, useTheme } from "@mui/material";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useContext, useRef } from "react";
import { AuthContext, AuthContextProps } from "../../context/authContext";
import { updateProfile } from "firebase/auth";
import { storage } from "../../firebase";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: "Avatar" | "Cover";
  setChange?: React.Dispatch<React.SetStateAction<boolean>>;
  setCoverURL?: React.Dispatch<React.SetStateAction<string | null>>;
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

export const ChangeAvatar = ({
  open,
  setOpen,
  type,
  setChange,
  setCoverURL,
}: Props) => {
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
      let storageRef;
      try {
        if (type === "Avatar") {
          storageRef = ref(
            storage,
            `avatars/${user!.uid}/${selectedFile.name}`
          );
        } else {
          storageRef = ref(storage, `covers/${user!.uid}/cover-${user!.uid}`);
        }
        const metadata = {
          customMetadata: {
            uid: user!.uid,
          },
        };
        await uploadBytes(storageRef, selectedFile, metadata);

        const downloadURL = await getDownloadURL(storageRef);

        if (type === "Avatar") {
          await updateProfile(user!, {
            photoURL: downloadURL,
          });
        } else {
          setCoverURL && setCoverURL(downloadURL);
        }
        console.log("Image URL stored in Firestore:", downloadURL);

        setOpen(false);
        setChange && setChange(false);
      } catch (error) {
        console.error("Error updating avatar:", error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      let storageRef;

      if (type === "Avatar") {
        storageRef = ref(
          storage,
          `avatars/${user!.uid}/${user!.uid}-avatar.jpg`
        );
        await updateProfile(user!, { photoURL: null });
      } else {
        storageRef = ref(storage, `covers/${user!.uid}/cover-${user!.uid}`);
        setCoverURL && setCoverURL(null);
      }

      await deleteObject(storageRef);
      setOpen(false);
      setChange && setChange(false);
    } catch (error) {
      console.error("Error deleting:", error);
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
            Change {type}
          </Typography>
        </Button>
        <Button fullWidth color="error" onClick={() => handleDelete()}>
          <Typography textTransform={"none"} variant="body1">
            Delete {type}
          </Typography>
        </Button>
      </Box>
    </Modal>
  );
};
