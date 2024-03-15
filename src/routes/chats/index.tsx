import { AuthLayout } from "../../components/templates/auth";
import { Divider, Skeleton, Stack, Typography } from "@mui/material";
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
  const [loading, setLoading] = useState(true);

  const { dispatch } = useContext(ChatContext) as ChatContextType;
  const { user } = useContext(AuthContext) as AuthContextProps;

  const handleSelect = async (chat: Chat) => {
    dispatch({ type: "CHANGE_USER", payload: chat });
    console.log("hi:", chat);
  };

  useEffect(() => {
    const fetchUserChats = async () => {
      try {
        setLoading(true);
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
                        lastMessage: chatData.lastMessage,
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
              setLoading(false);
            } else {
              console.log("User Chats data is not in the expected format");
            }
          } else {
            console.log("User Chats data not found");
          }
        }
      } catch (error) {
        console.error("Error fetching userChats data:", error);
        setLoading(false);
      }
    };
    fetchUserChats();
  }, [user]);

  console.log(chats);
  return (
    <AuthLayout>
      <Stack alignSelf={"center"} width={"100%"} height={"100%"} p={4}>
        <Typography marginBottom={2} variant="h2" fontSize={"24px"}>
          chats
        </Typography>
        {loading && (
          <>
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} width="100%" height={80} />
            ))}
          </>
        )}
        {!loading && chats?.length === 0 && (
          <Typography variant="h6">You do not have any chats.</Typography>
        )}
        {chats
          ?.sort((a, b) =>
            a.chat.createdAt && b.chat.createdAt
              ? a.chat.createdAt - b.chat.createdAt
              : 1
          )
          .map((userChat) => (
            <>
              <ChatComp
                key={userChat.chat.id}
                user={userChat.userData}
                handleSelect={() => handleSelect(userChat.chat)}
                chat={userChat.chat}
              />
              <Divider />
            </>
          ))}
      </Stack>
    </AuthLayout>
  );
};

export default Chats;
