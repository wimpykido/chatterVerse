import { AuthLayout } from "../../components/templates/auth";
import { Stack, useTheme } from "@mui/material";
import ChatComp from "./chat-comp";
import { useContext, useEffect, useState } from "react";
import { Chat, ChatContext, ChatContextType } from "../../context/chat-context";
import { AuthContext, AuthContextProps } from "../../context/authContext";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

type UserChats = {
  chat: Chat;
  userData: DocumentData;
};

const Chats = () => {
  const [chats, setChats] = useState<Array<UserChats> | null>([]);

  const { dispatch } = useContext(ChatContext) as ChatContextType;
  const { user } = useContext(AuthContext) as AuthContextProps;

  const handleSelect = async (chat: Chat) => {
    dispatch({ type: "CHANGE_USER", payload: chat });
    console.log("hi:", chat);
  };

  useEffect(() => {
    const fetchUserChats = async () => {
      try {
        if (user) {
          const userChatsDocRef = doc(db, "userChats", user.uid);
          const userChatsDocSnap = await getDoc(userChatsDocRef);

          if (userChatsDocSnap.exists()) {
            const userChatsData = userChatsDocSnap.data();
            if (userChatsData) {
              const usersArrayPromises = Object.entries(userChatsData).map(
                async ([chatId, chatData]) => {
                  const userDocRef = doc(db, "users", chatData.userInfo.id);
                  const userDocSnap = await getDoc(userDocRef);

                  if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    return {
                      chat: {
                        id: chatData.userInfo.id,
                        createdAt: chatData.date,
                        lastMessage: chatData.lastMessage.message,
                        chatId: chatId,
                      },
                      userData: userData,
                    };
                  } else {
                    console.log("User not found in the 'users' collection");
                    return null;
                  }
                }
              );

              const validUsersArray = (
                await Promise.all(usersArrayPromises)
              ).filter((user) => user !== null) as unknown as UserChats[];

              validUsersArray.sort(
                (a, b) => a.chat.createdAt - b.chat.createdAt
              );
              console.log(validUsersArray);
              setChats(validUsersArray);
            } else {
              console.log("User Chats data is not in the expected format");
            }
          } else {
            console.log("User Chats data not found");
          }
        }
      } catch (error) {
        console.error("Error fetching userChats data:", error);
      }
    };
    fetchUserChats();
  }, [user]);

  return (
    <AuthLayout>
      <Stack width={"80%"} height={"100%"} p={4}>
        {chats
          ?.sort((a, b) =>
            a.chat.createdAt && b.chat.createdAt
              ? a.chat.createdAt - b.chat.createdAt
              : 1
          )
          .map((userChat) => (
            <ChatComp
              key={userChat.chat.id}
              user={userChat.userData}
              handleSelect={() => handleSelect(userChat.chat)}
              chat={userChat.chat}
            />
          ))}
      </Stack>
    </AuthLayout>
  );
};

export default Chats;
