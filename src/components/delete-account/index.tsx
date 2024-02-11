import { Box, Button, Modal, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { deleteUser, signOut } from "firebase/auth";
import { AuthContext, AuthContextProps } from "../../context/authContext";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export const DeleteAccount = () => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useContext(AuthContext) as AuthContextProps;
  const navigate = useNavigate();
  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await deleteUser(user!);
      console.log("Account deleted successfully");
      await signOut(auth);
      navigate("/sign-in");
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
        Delete Account
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="delete-account"
        aria-describedby="delete-account-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete your account?
          </Typography>
          <Typography variant="body1" paragraph>
            This action cannot be undone. Deleting your account will permanently
            remove all associated data.
          </Typography>
          <Box
            marginTop={2}
            width={"100%"}
            gap={2}
            display="flex"
            justifyContent="space-between"
            alignItems={"center"}
          >
            <Button
              variant="contained"
              color="error"
              disabled={isDeleting}
              onClick={handleDeleteAccount}
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
