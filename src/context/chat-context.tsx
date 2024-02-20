import { ReactNode, createContext, useContext, useReducer } from "react";
import { AuthContext, AuthContextProps } from "./authContext";

export type Chat = {
  id: string;
  createdAt: number;
  lastMessage: string;
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
};

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export const ChatContextProvider = ({ children }: Props) => {
  const initialState = {
    chatId: null,
    chat: {} as Chat,
  };

  const authContext = useContext(AuthContext) as AuthContextProps;
  const { user } = authContext;

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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
