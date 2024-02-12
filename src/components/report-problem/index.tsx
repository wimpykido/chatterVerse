import { Button, Modal, Box, TextField, Typography } from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { useContext, useState } from "react";
import { AuthContext, AuthContextProps } from "../../context/authContext";

export const ProblemReport = () => {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const { user } = useContext(AuthContext) as AuthContextProps;

  const handleReportModalClose = () => {
    setReportModalOpen(false);
    setReportText("");
  };

  const handleReportModalSubmit = async () => {
    if (reportText.trim() === "") {
      console.error("Error: Description cannot be empty");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "reports"), {
        problemDescription: reportText,
        timestamp: new Date(),
        reporter: user!.email,
      });

      console.log("Report submitted successfully. Document ID:", docRef.id);
    } catch (error) {
      console.error("Error submitting report:", error);
    }

    handleReportModalClose();
  };

  return (
    <>
      <Button
        onClick={() => setReportModalOpen(true)}
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

      <Modal
        open={reportModalOpen}
        onClose={handleReportModalClose}
        aria-labelledby="report-modal-title"
        aria-describedby="report-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="report-modal-title" variant="h6" component="h2">
            Report a Problem
          </Typography>
          <TextField
            label="Describe the problem"
            multiline
            rows={4}
            fullWidth
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
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
              variant="outlined"
              onClick={handleReportModalClose}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              fullWidth
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
              onClick={handleReportModalSubmit}
              color="primary"
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
