import {
  ReactNode,
  useState,
  createContext,
  useContext,
  useEffect,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  Theme,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

type Props = {
  children: ReactNode;
};

export type ThemeContextType = {
  toggleDarkMode: () => void;
  darkMode: boolean;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

const ThemeProvider = ({ children }: Props) => {
  const storedDarkMode = localStorage.getItem("darkMode");
  const [darkMode, setDarkMode] = useState(
    storedDarkMode ? JSON.parse(storedDarkMode) : true
  );

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode: boolean) => !prevDarkMode);
  };

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#FFFFFF",
        light: "#f5f5f5",
        dark: "#00A3FF",
        contrastText: "#515151",
      },
      secondary: {
        main: "#171717",
        light: "#f5f5f5",
        dark: "#dfdfdf",
        contrastText: "#FFFFFF",
      },
      info: {
        main: "#e3e5e8",
        light: "#f2f3f5",
        dark: "#ffffff",
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#121212",
        light: "#181818",
        dark: "#00A3FF",
        contrastText: "#f5f5f5",
      },
      secondary: {
        main: "#FFFFFF",
        light: "#181818",
        dark: "#303030",
        contrastText: "#171717",
      },
      info: {
        main: "#1e1f22",
        light: "#2b2d31",
        dark: "#111214",
      },
    },
  });

  const theme: Theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ toggleDarkMode, darkMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
