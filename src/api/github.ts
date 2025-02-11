interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  id: number;
}

interface GitHubApiResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubUser[];
}

export const PER_PAGE = 30;

// Prosty przykład programowania funkcyjnego, użycie reduce łączy tablice items w jedną tablicę wynikową
export const flattenUsers = (pages: GitHubApiResponse[]): GitHubUser[] =>
  pages.reduce<GitHubUser[]>((acc, page) => [...acc, ...page.items], []);

export const fetchUsers = async ({
  queryKey,
  pageParam = 1,
}: {
  queryKey: [string, string];
  pageParam?: number;
}): Promise<GitHubApiResponse> => {
  const [, query] = queryKey;
  const response = await fetch(
    `https://api.github.com/search/users?q=${query}&page=${pageParam}&per_page=${PER_PAGE}`
  );
  if (!response.ok) {
    const errorData = await response.json();
    if (
      errorData.message &&
      errorData.message.toLowerCase().includes("rate limit exceeded")
    ) {
      throw new Error(
        "Osiągnięto limit darmowych zapytań API GitHub. Spróbuj ponownie później."
      );
    }
    throw new Error(errorData.message || "Błąd podczas pobierania danych");
  }
  return response.json();
};
