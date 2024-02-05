import { Box, IconButton } from "@mui/material";
import google from "../../assets/google.png";
import facebook from "../../assets/facebook.png";

const ContinueWith = () => {
  return (
    <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
      <IconButton>
        <img width={"32px"} height={"32px"} src={google} alt="Icon 1" />
      </IconButton>
      <IconButton>
        <img width={"32px"} height={"32px"} src={facebook} alt="Icon 2" />
      </IconButton>
    </Box>
  );
};

export default ContinueWith;
