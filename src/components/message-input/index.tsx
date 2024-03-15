import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Message, MessageType } from "../../routes/chat-room";
import { useContext, useRef, useState } from "react";
import { AuthContext, AuthContextProps } from "../../context/authContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

type Props = {
  chatId: string;
  userId: string;
};

export const MessageInput = ({ chatId, userId }: Props) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const theme = useTheme();
  const { user } = useContext(AuthContext) as AuthContextProps;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);

      // Display a preview of the selected file
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const sendMessage = async () => {
    try {
      let message: Message;

      if (text && !file) {
        message = {
          type: MessageType.Text,
          content: text,
          senderId: user!.uid,
          timestamp: Timestamp.now().toMillis(),
        };
        updateFirestore(message);
      } else if (file) {
        const reader = new FileReader();

        reader.onload = async (event) => {
          const fileContent = event.target!.result as string;
          const fileType = file.type.startsWith("image/")
            ? MessageType.Image
            : MessageType.Video;

          if (fileType === MessageType.Video) {
            const storageRef = ref(storage, `videos/${user!.uid}/${file.name}`);
            await uploadString(storageRef, fileContent, "data_url");
            const videoUrl = await getDownloadURL(storageRef);

            message = {
              type: fileType,
              content: videoUrl,
              senderId: user!.uid,
              timestamp: Timestamp.now().toMillis(),
            };
          } else {
            message = {
              type: fileType,
              content: fileContent,
              senderId: user!.uid,
              timestamp: Timestamp.now().toMillis(),
            };
          }
          console.log(message);
          updateFirestore(message);
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
        };
        reader.readAsDataURL(file);
        setFilePreview(null);
      } else {
        return;
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const updateFirestore = async (message: Message) => {
    try {
      const chatDocRef = doc(db, "chats", chatId);
      console.log("Message:", message);
      await updateDoc(chatDocRef, {
        messages: arrayUnion(message),
      });

      const userChatUpdate = {
        [`${chatId}.lastMessage`]: message,
        [`${chatId}.date`]: serverTimestamp(),
      };

      await updateDoc(doc(db, "userChats", user!.uid), userChatUpdate);
      await updateDoc(doc(db, "userChats", userId), userChatUpdate);

      console.log("Update successful");
      setText("");
      setFile(null);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  return (
    <Box borderRadius={2} width={"100%"} bgcolor={theme.palette.info.main}>
      <input
        type="file"
        accept="image/*,video/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      {filePreview && (
        <img src={filePreview} alt="File Preview" style={{ width: "100px" }} />
      )}
      <TextField
        placeholder="Type your message..."
        fullWidth
        variant="outlined"
        value={text}
        onChange={(e) => setText(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <EmojiEmotionsIcon />
              </IconButton>
              <IconButton onClick={handleButtonClick}>
                <AttachFileIcon />
              </IconButton>
              <IconButton onClick={sendMessage}>
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            border: "none",
            "&.Mui-focused": {
              border: "none",
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "& .MuiInputBase-input": {
            outline: "none",
          },
        }}
      />
    </Box>
  );
};
