import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { DetailType } from "../../routes/profile";
import { Editing } from "../edit-detail";
import { PhoneAuthCredential } from "firebase/auth";

type Props = {
  detailType: DetailType;
  userDetail?: string | null;
  editDisplayName?: (editedValue: string) => Promise<void>;
  editEmail?: (editedValue: string, currentPassword: string) => Promise<void>;
  editPhoneNumber?: (editedValue: PhoneAuthCredential) => Promise<void>;
  editBio?: (editedValue: string) => Promise<void>;
};

export const UserDetail = ({
  detailType,
  userDetail,
  editDisplayName,
  editEmail,
  editBio,
}: Props) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Stack>
        <Typography
          fontWeight={700}
          variant="body2"
          fontSize={"10px"}
          textTransform={"uppercase"}
        >
          {detailType}
        </Typography>
        <Typography
          fontSize={"14px"}
          color={theme.palette.primary.contrastText}
        >
          {userDetail ? userDetail : `You haven't added ${detailType} yet.`}
        </Typography>
      </Stack>
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        sx={{
          border: "1px solid #4e5058",
          textTransform: "none",
          backgroundColor: "#4e5058",
          color: "white",
          fontWeight: 400,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
            backgroundColor: "#6d6f78",
            border: "1px solid #6d6f78",
          },
          fontSize: 12,
        }}
      >
        {userDetail ? "edit" : "add"}
      </Button>
      <Editing
        editEmail={editEmail}
        editDisplayName={editDisplayName}
        detailType={detailType}
        open={open}
        setOpen={setOpen}
        userDetail={userDetail}
        editBio={editBio}
      />
    </Box>
  );
};
