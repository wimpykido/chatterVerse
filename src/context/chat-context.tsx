import { ReactNode, createContext, useContext, useReducer } from "react";
import { AuthContext, AuthContextProps } from "./authContext";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Message } from "../routes/chat-room";

export type Chat = {
  id: string;
  createdAt: number;
  lastMessage: Message;
  chatId: string;
};

type Props = {
  children: ReactNode;
};

type ChatState = {
  chatId: string | null;
  chat: Chat;
};

type ChatAction = {
  type: string;
  payload: Chat;
};

export type ChatContextType = {
  data: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  getUserById(userId: string): Promise<DocumentData>;
};

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export const ChatContextProvider = ({ children }: Props) => {
  const initialState = {
    chatId: null,
    chat: {} as Chat,
    getUserById: () => {},
  };

  const authContext = useContext(AuthContext) as AuthContextProps;
  const { user } = authContext;

  async function getUserById(userId: string) {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        return userData;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }
  const chatReducer = (state: ChatState, action: ChatAction) => {
    switch (action.type) {
      case "CHANGE_USER": {
        const currentUserUid = user?.uid;
        const otherUserId = action.payload.id;

        if (currentUserUid && otherUserId) {
          const chatId =
            currentUserUid > otherUserId
              ? `${currentUserUid}_${otherUserId}`
              : `${otherUserId}_${currentUserUid}`;

          console.log(chatId);
          return {
            ...state,
            chat: action.payload,
            chatId: chatId,
          };
        } else {
          console.error("User IDs are not available.");
          return state;
        }
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider
      value={{
        data: state,
        dispatch,
        getUserById,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
