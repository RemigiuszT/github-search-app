import { useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import SearchForm from "./components/SearchForm";
import UserList from "./components/UserList";

function App() {
  const [query, setQuery] = useState("");
  const [totalCount, setTotalCount] = useState<number | null>(null);

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">GitHub Profile Searcher</Typography>
        {totalCount !== null && (
          <Typography variant="body2" color="textSecondary">
            Wyników: {totalCount}
          </Typography>
        )}
      </Box>

      <SearchForm onSearch={setQuery} />

      <Box mt={3}>
        <UserList query={query} onTotalCountChange={setTotalCount} />
      </Box>
    </Container>
  );
}

export default App;
