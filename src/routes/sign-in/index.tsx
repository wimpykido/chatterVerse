import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UnauthLayout } from "../../components/templates/unauth";
import ContinueWith from "../../components/continue-with";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { ChangeEvent, useContext, useState } from "react";
import { AuthContext, AuthContextProps } from "../../context/authContext";

type SignInFormFields = {
  email: string;
  password: string;
};

const signInFormDefaultValues: SignInFormFields = {
  email: "",
  password: "",
};

const SingIn = () => {
  const [form, setForm] = useState<SignInFormFields>(signInFormDefaultValues);
  const { setUser } = useContext(AuthContext) as AuthContextProps;

  const navigate = useNavigate();
  const theme = useTheme();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof SignInFormFields
  ) => {
    const { value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [field]: value }));
  };

  const handleLogin = () => {
    try {
      signInWithEmailAndPassword(auth, form.email, form.password);
      const user = auth.currentUser!;
      setUser(user);
      user && navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <UnauthLayout>
      <Stack
        padding={3}
        width={"500px"}
        bgcolor={theme.palette.primary.main}
        borderRadius={2}
      >
        <Typography
          variant="h1"
          fontSize={"36px"}
          fontWeight={"600"}
          textAlign="center"
        >
          Welcome Back!
        </Typography>
        <Typography
          color={theme.palette.primary.contrastText}
          variant="body2"
          textAlign="center"
          fontWeight={400}
        >
          Don&apos;t have an account?{" "}
          <Box
            display="inline"
            sx={{
              fontWeight: "600",
              ":hover": {
                cursor: "pointer",
              },
            }}
            onClick={() => navigate("/sign-up")}
          >
            Sign up
          </Box>
        </Typography>
        <FormControl>
          <TextField
            type="email"
            id="email"
            variant="outlined"
            placeholder="Email"
            margin="normal"
            onChange={(e) => handleInputChange(e, "email")}
            value={form.email}
            required
          />
          <TextField
            type="password"
            id="password"
            variant="outlined"
            placeholder="Password"
            margin="normal"
            onChange={(e) => handleInputChange(e, "password")}
            value={form.password}
            required
          />
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    "&.Mui-checked": { color: "black" },
                  }}
                />
              }
              label={"keep me signed in"}
            />
            <Typography>forgot password?</Typography>
          </Box>
          <Button
            onClick={handleLogin}
            variant="contained"
            fullWidth
            sx={{
              border: `1px solid ${theme.palette.secondary.main}`,
              textTransform: "none",
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              fontWeight: 400,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
                color: theme.palette.secondary.main,
                backgroundColor: theme.palette.primary.main,
                border: `1px solid ${theme.palette.secondary.main}`,
              },
              fontSize: 18,
            }}
          >
            Continue
          </Button>
        </FormControl>
        <Typography margin={2} textAlign={"center"}>
          or continue with
        </Typography>
        <ContinueWith />
      </Stack>
    </UnauthLayout>
  );
};

export default SingIn;
