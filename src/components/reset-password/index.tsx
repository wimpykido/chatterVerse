import { Box, Button, Modal, TextField } from "@mui/material";
import { ChangeEvent, useContext, useState } from "react";
import { AuthContext, AuthContextProps } from "../../context/authContext";
import {
  GoogleAuthProvider,
  reauthenticateWithPopup,
  updatePassword,
} from "firebase/auth";

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

export const ResetPassword = () => {
  const [passwordObj, setPasswordObj] = useState({
    password: "",
    repeatPassword: "",
  });
  const [open, setOpen] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [repeatPasswordError, setRepeatPasswordError] = useState<string | null>(
    null
  );

  const { user } = useContext(AuthContext) as AuthContextProps;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof {
      password: string;
      repeatPassword: string;
    }
  ) => {
    const { value } = e.target;

    if (field === "password") {
      if (value.length < 6) {
        setPasswordError("Password must be at least 6 characters long");
      } else {
        setPasswordError(null);
      }
    }

    if (field === "repeatPassword" && passwordObj.password !== value) {
      setRepeatPasswordError("Passwords do not match");
    } else {
      setRepeatPasswordError(null);
    }

    setPasswordObj((prevForm) => ({ ...prevForm, [field]: value }));
  };

  const changePassword = async () => {
    try {
      if (user?.providerData[0]?.providerId === "google.com") {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user!, provider);
      }

      await updatePassword(user!, passwordObj.password);

      setOpen(false);
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };
  return (
    <>
      <Button
        sx={{
          border: "1px solid #5865f2",
          textTransform: "none",
          backgroundColor: "#5865f2",
          color: "white",
          fontWeight: 400,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
            backgroundColor: "#4752c4",
            border: "1px solid #4752c4",
          },
          fontSize: 14,
        }}
        onClick={() => setOpen(true)}
      >
        Reset Password
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="password-reset"
        aria-describedby="change-password"
      >
        <Box
          sx={style}
          flexDirection={"column"}
          display="flex"
          justifyContent="center"
          alignItems={"center"}
        >
          <TextField
            type="password"
            id="password"
            variant="outlined"
            placeholder="Enter new password"
            margin="normal"
            onChange={(e) => handleInputChange(e, "password")}
            value={passwordObj.password}
            error={!!passwordError}
            helperText={passwordError}
            required
            fullWidth
          />
          <TextField
            type="password"
            id="repeat-password"
            variant="outlined"
            placeholder="Repeat new password"
            margin="normal"
            onChange={(e) => handleInputChange(e, "repeatPassword")}
            value={passwordObj.repeatPassword}
            error={!!repeatPasswordError}
            helperText={repeatPasswordError}
            required
            fullWidth
          />
          <Box
            marginTop={2}
            width={"100%"}
            gap={2}
            display="flex"
            justifyContent="space-between"
            alignItems={"center"}
          >
            <Button
              fullWidth
              disabled={
                passwordError ||
                repeatPasswordError ||
                passwordObj.password === "" ||
                passwordObj.repeatPassword === ""
                  ? true
                  : false
              }
              sx={{
                border: "1px solid #5865f2",
                textTransform: "none",
                backgroundColor: "#5865f2",
                color: "white",
                fontWeight: 400,
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                  backgroundColor: "#4752c4",
                  border: "1px solid #4752c4",
                },
                fontSize: 14,
              }}
              onClick={() => {
                changePassword();
                setOpen(false);
              }}
            >
              Done
            </Button>
            <Button
              fullWidth
              color="secondary"
              variant="outlined"
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
