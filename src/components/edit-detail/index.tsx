import { Box, Button, Modal, TextField } from "@mui/material";
import React, { useState } from "react";
import { DetailType } from "../../routes/profile";
import { MuiTelInput } from "mui-tel-input";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  detailType?: DetailType;
  userDetail?: string | null;
  editDisplayName?: (editedValue: string) => Promise<void>;
  editEmail?: (editedValue: string, currentPassword: string) => Promise<void>;
  editBio?: (editedValue: string) => Promise<void>;
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

export const Editing = ({
  open,
  setOpen,
  userDetail,
  detailType,
  editDisplayName,
  editEmail,
  editBio,
}: Props) => {
  const [editedValue, setEditedValue] = useState(userDetail);
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleDone = async () => {
    if (detailType === DetailType.EMAIL && !isValidEmail(editedValue!)) {
      setEmailError("Invalid email address");
      return;
    }
    if (detailType === DetailType.EMAIL && password.trim() === "") {
      setPasswordError("Please enter your password");
      return;
    }
    setEmailError(null);
    setPasswordError(null);
    if (editDisplayName) {
      await editDisplayName(editedValue!);
    } else if (editEmail) {
      editEmail(editedValue!, password);
    } else if (editBio) {
      editBio(editedValue!);
    }

    setOpen(false);
    setEditedValue("");
    setPassword("");
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="editing-modal"
      aria-describedby="modal-to-edit-user-detail"
    >
      <Box sx={style}>
        {detailType === DetailType.PHONENUMBER ? (
          <MuiTelInput
            defaultCountry="GE"
            value={editedValue!}
            onChange={(value) => setEditedValue(value)}
          />
        ) : (
          <TextField
            fullWidth
            rows={detailType === DetailType.BIO ? 5 : 1}
            label={`Edit ${detailType}`}
            variant="outlined"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            error={detailType === DetailType.EMAIL && !!emailError}
            helperText={emailError}
          />
        )}
        {detailType === DetailType.EMAIL && (
          <TextField
            fullWidth
            required
            placeholder="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={detailType === DetailType.EMAIL && !!passwordError}
            helperText={passwordError}
          />
        )}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
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
              ml: 2,
            }}
            onClick={handleDone}
            variant="contained"
          >
            Done
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
