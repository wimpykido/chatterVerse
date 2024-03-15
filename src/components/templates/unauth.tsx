import { Box, useTheme } from "@mui/material";
import { ReactNode } from "react";
type Props = {
  children: ReactNode;
};
export const UnauthLayout = ({ children }: Props) => {
  const theme = useTheme();
  return (
    <Box
      bgcolor={theme.palette.secondary.light}
      height={"100vh"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
    >
      {children}
    </Box>
  );
};