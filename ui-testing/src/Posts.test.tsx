import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import Posts from "./Posts";

const fakePosts = [
  {
    id: 1,
    title: "title one",
    body: "body one",
  },
  {
    id: 2,
    title: "title two",
    body: "body two",
  },
];

const server = setupServer(
  http.get("https://dummyjson.com/posts", () => {
    return HttpResponse.json({ posts: fakePosts });
  }),
);
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("<Posts />", () => {
  test("renders posts correctly", async () => {
    render(<Posts />);
    await waitForElementToBeRemoved(() => screen.getByText(/Loading.../i));
    expect(screen.getAllByTestId("post-card")).toHaveLength(fakePosts.length);
    fakePosts.forEach((post) => {
      expect(
        screen.getByRole("heading", { level: 2, name: post.title }),
      ).toBeInTheDocument();
      expect(screen.getByText(post.body)).toBeInTheDocument();
    });
  });

  test("handles fetch error", async () => {
    server.use(
      http.get("https://dummyjson.com/posts", () => {
        return HttpResponse.json({}, { status: 400 });
      }),
    );
    render(<Posts />);
    await waitForElementToBeRemoved(() => screen.getByText(/Loading.../i));
    expect(screen.getByText(/Failed to fetch posts/i)).toBeInTheDocument();
  });

  test("displays loading state", () => {
    render(<Posts />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test("displays no posts message when API returns empty array", async () => {
    server.use(
      http.get("https://dummyjson.com/posts", () => {
        return HttpResponse.json({ posts: [] });
      }),
    );
    render(<Posts />);
    await waitForElementToBeRemoved(() => screen.getByText(/Loading.../i));
    expect(screen.getByText(/No posts available/i)).toBeInTheDocument();
  });
});
