import { ReactNode, useState, createContext, useEffect } from "react";
import { getRedirectResult, onAuthStateChanged, User } from "firebase/auth";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";

type AuthProviderProps = {
  children: ReactNode;
};
export type AuthContextProps = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  googleSignIn: () => void;
  facebookSignIn: () => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
    const result = await getRedirectResult(auth);
    console.log(result?.user);
    return result!.user;
  };

  const facebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    signInWithRedirect(auth, provider);
    console.log(auth.currentUser);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false);
      setUser(currentUser || null);
    });

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  const values = {
    user: user,
    setUser: setUser,
    googleSignIn: googleSignIn,
    facebookSignIn: facebookSignIn,
    loading: loading,
  };
  return (
    <AuthContext.Provider value={values}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
