import {
  Box,
  Button,
  FormControl,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UnauthLayout } from "../../components/templates/unauth";
import ContinueWith from "../../components/continue-with";
import { ChangeEvent, useContext, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext, AuthContextProps } from "../../context/authContext";

type SignUpFormFields = {
  email: string;
  password: string;
  repeatPassword: string;
};

const signUpFormDefaultValues: SignUpFormFields = {
  email: "",
  password: "",
  repeatPassword: "",
};

const SingUp = () => {
  const [form, setForm] = useState<SignUpFormFields>(signUpFormDefaultValues);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [repeatPasswordError, setRepeatPasswordError] = useState<string | null>(
    null
  );
  const { setUser } = useContext(AuthContext) as AuthContextProps;
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof SignUpFormFields
  ) => {
    const { value } = e.target;

    if (field === "password") {
      if (value.length < 6) {
        setPasswordError("Password must be at least 6 characters long");
      } else {
        setPasswordError(null);
      }
    }

    if (field === "repeatPassword" && form.password !== value) {
      setRepeatPasswordError("Passwords do not match");
    } else {
      setRepeatPasswordError(null);
    }

    setForm((prevForm) => ({ ...prevForm, [field]: value }));
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const newUser = userCredential.user;
      await setDoc(doc(db, "users", newUser.uid), {
        photoURL: newUser.photoURL || "",
        coverURL: "",
        email: newUser.email || "",
        id: newUser.uid,
        displayName: newUser.displayName || "",
        phoneNumber: newUser.phoneNumber || "",
        emailVerified: newUser.emailVerified,
        bio: "",
      });
      setUser(auth.currentUser!);
      auth.currentUser! && navigate("/profile");
      await setDoc(doc(db, "userChats", auth.currentUser!.uid), {});
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();
  const theme = useTheme();
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
          Create account
        </Typography>
        <Typography
          color={theme.palette.primary.contrastText}
          variant="body2"
          textAlign="center"
          fontWeight={400}
        >
          Already have an account?{" "}
          <Box
            display="inline"
            sx={{
              fontWeight: "600",
              ":hover": {
                cursor: "pointer",
              },
            }}
            onClick={() => navigate("/sign-in")}
          >
            Sign in
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
            error={!!passwordError}
            helperText={passwordError}
            required
          />
          <TextField
            type="password"
            id="repeat-password"
            variant="outlined"
            placeholder="Repeat password"
            margin="normal"
            onChange={(e) => handleInputChange(e, "repeatPassword")}
            value={form.repeatPassword}
            error={!!repeatPasswordError}
            helperText={repeatPasswordError}
            required
          />
          <Button
            onClick={handleSignUp}
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

export default SingUp;
