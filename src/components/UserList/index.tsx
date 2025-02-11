import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import { fetchUsers, flattenUsers, PER_PAGE } from "../../api/github";

interface UserListProps {
  query: string;
  onTotalCountChange?: (count: number) => void;
}

const UserList: React.FC<UserListProps> = ({ query, onTotalCountChange }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isError,
    isLoading,
    refetch,
  } = useInfiniteQuery(
    ["users", query],
    ({ pageParam = 1 }) =>
      fetchUsers({ queryKey: ["users", query], pageParam }),
    {
      enabled: query.trim() !== "",
      getNextPageParam: (lastPage, pages) => {
        const totalFetched = pages.length * PER_PAGE;
        return totalFetched < lastPage.total_count
          ? pages.length + 1
          : undefined;
      },
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  useEffect(() => {
    if (query.trim() !== "") {
      refetch();
    }
  }, [query, refetch]);

  useEffect(() => {
    if (data) {
      const lastPage = data.pages[data.pages.length - 1];
      onTotalCountChange?.(lastPage.total_count);
    }
  }, [data, onTotalCountChange]);

  if (!query.trim()) {
    return (
      <Typography variant="body2">
        Wpisz nazwę użytkownika aby rozpocząć wyszukiwanie.
      </Typography>
    );
  }

  if (isLoading) {
    return <Typography variant="body2">Ładowanie...</Typography>;
  }

  if (isError) {
    return (
      <Typography variant="body2" color="error">
        {(error as Error).message}
      </Typography>
    );
  }

  const allUsers = data ? flattenUsers(data.pages) : [];

  if (allUsers.length === 0) {
    return <Typography variant="body2">Brak wyników.</Typography>;
  }

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={() => fetchNextPage()}
      hasMore={!!hasNextPage && !isFetchingNextPage}
      loader={
        <Typography key={0} variant="body2">
          Ładowanie...
        </Typography>
      }
    >
      <Box
        mt={2}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 2, // Dodaje odstępy 2*8px = 16px między kolumnami i wierszami
          p: 0,
          m: 0,
          width: "100%",
        }}
      >
        {allUsers.map((user) => (
          <Card
            key={user.id}
            sx={{
              width: "100%",
              borderRadius: 0,
            }}
          >
            <CardMedia
              component="img"
              image={user.avatar_url}
              alt={user.login}
              sx={{ width: "100%", height: "auto" }}
            />
            <CardContent>
              <Tooltip title={user.login}>
                <Typography
                  variant="h5"
                  noWrap
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 180,
                  }}
                >
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    {user.login}
                  </a>
                </Typography>
              </Tooltip>
            </CardContent>
          </Card>
        ))}
      </Box>
    </InfiniteScroll>
  );
};

export default UserList;
