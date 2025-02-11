import { flattenUsers } from "../../api/github";

test("flattenUsers correctly flattens pages", () => {
  const pages = [
    {
      total_count: 2,
      incomplete_results: false,
      items: [{ id: 1, login: "user1", avatar_url: "", html_url: "" }],
    },
    {
      total_count: 2,
      incomplete_results: false,
      items: [{ id: 2, login: "user2", avatar_url: "", html_url: "" }],
    },
  ];

  const result = flattenUsers(pages);
  expect(result).toHaveLength(2);
  expect(result[0].login).toBe("user1");
  expect(result[1].login).toBe("user2");
});
