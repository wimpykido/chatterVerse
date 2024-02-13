import { Box, Stack } from "@mui/material";
import { SearchBar } from "../../components/search-bar";
import { AuthLayout } from "../../components/templates/auth";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { UserListItem } from "../../components/user";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<Array<DocumentData>>([]);
  const [filteredUsers, setFilteredUsers] = useState<Array<DocumentData>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value === "") {
      setFilteredUsers([]);
    } else {
      const filtered = users.filter(
        (user) =>
          user.displayName!.toLowerCase().includes(value.toLowerCase()) ||
          user.email!.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const userData = usersSnapshot.docs.map((doc) => doc.data());
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <AuthLayout>
      <Box
        p={4}
        alignSelf={"flex-start"}
        width={"80%"}
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}
        alignItems={"flex-start"}
      >
        <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Stack width={"100%"} alignSelf={"center"}>
            {filteredUsers.map((user) => (
              <UserListItem user={user} key={user.uid} />
            ))}
          </Stack>
        )}
      </Box>
    </AuthLayout>
  );
};

export default Search;
