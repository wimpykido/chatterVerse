import { DocumentData } from "firebase/firestore";
import Received from "./received";
import Sent from "./sent";

type Props = {
  otherUser?: DocumentData;
  message: DocumentData;
};

const Message = ({ otherUser, message }: Props) => {
  return otherUser ? (
    <Received user={otherUser} message={message} />
  ) : (
    <Sent message={message} />
  );
};

export default Message;
