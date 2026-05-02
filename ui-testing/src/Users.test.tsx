import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  fireEvent,
} from "@testing-library/react";
import Users from "./Users";

const fakeUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    age: 28,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    age: 35,
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol@example.com",
    age: 22,
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david@example.com",
    age: 42,
  },
];

const server = setupServer(
  http.get("https://dummyjson.com/users", () => {
    return HttpResponse.json({ users: fakeUsers });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("<Users />", () => {
  test("displays loading state initially", () => {
    render(<Users />);
    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });

  test("renders users correctly after loading", async () => {
    render(<Users />);
    await waitForElementToBeRemoved(() => screen.getByTestId("loading-state"));

    expect(screen.getByTestId("users-container")).toBeInTheDocument();
    expect(screen.getAllByTestId("user-card")).toHaveLength(fakeUsers.length);

    fakeUsers.forEach((user) => {
      expect(
        screen.getByRole("heading", { level: 3, name: user.name }),
      ).toBeInTheDocument();
      expect(screen.getByText(new RegExp(user.email))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`${user.age}`))).toBeInTheDocument();
    });
  });

  test("displays error message when fetch fails", async () => {
    server.use(
      http.get("https://dummyjson.com/users", () => {
        return HttpResponse.json({}, { status: 500 });
      }),
    );
    render(<Users />);
    await waitForElementToBeRemoved(() => screen.getByTestId("loading-state"));
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
    expect(screen.getByText(/Failed to fetch users/i)).toBeInTheDocument();
  });

  test("displays empty state when no users available", async () => {
    server.use(
      http.get("https://dummyjson.com/users", () => {
        return HttpResponse.json({ users: [] });
      }),
    );
    render(<Users />);
    await waitForElementToBeRemoved(() => screen.getByTestId("loading-state"));
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  test("filters users by search term (name)", async () => {
    render(<Users />);
    await waitForElementToBeRemoved(() => screen.getByTestId("loading-state"));

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "Alice" } });

    expect(screen.getAllByTestId("user-card")).toHaveLength(1);
    expect(
      screen.getByRole("heading", { level: 3, name: "Alice Johnson" }),
    ).toBeInTheDocument();
  });

  test("filters users by search term (email)", async () => {
    render(<Users />);
    await waitForElementToBeRemoved(() => screen.getByTestId("loading-state"));

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "bob@example" } });

    expect(screen.getAllByTestId("user-card")).toHaveLength(1);
    expect(
      screen.getByRole("heading", { level: 3, name: "Bob Smith" }),
    ).toBeInTheDocument();
  });

  test("filters users by minimum age", async () => {
    render(<Users />);
    await waitForElementToBeRemoved(() => screen.getByTestId("loading-state"));

    const ageInput = screen.getByTestId("age-input");
    fireEvent.change(ageInput, { target: { value: "30" } });

    expect(screen.getAllByTestId("user-card")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { level: 3, name: "Bob Smith" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "David Wilson" }),
    ).toBeInTheDocument();
  });

  test("filters users by both search term and age", async () => {
    render(<Users />);
    await waitForElementToBeRemoved(() => screen.getByTestId("loading-state"));

    const searchInput = screen.getByTestId("search-input");
    const ageInput = screen.getByTestId("age-input");

    fireEvent.change(searchInput, { target: { value: "David" } });
    fireEvent.change(ageInput, { target: { value: "40" } });

    expect(screen.getAllByTestId("user-card")).toHaveLength(1);
    expect(
      screen.getByRole("heading", { level: 3, name: "David Wilson" }),
    ).toBeInTheDocument();
  });

  test("displays 'no results' message when filters return no matches", async () => {
    render(<Users />);
    await waitForElementToBeRemoved(() => screen.getByTestId("loading-state"));

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "NonExistentUser" } });

    expect(screen.getByTestId("no-results")).toBeInTheDocument();
    expect(screen.queryByTestId("user-card")).not.toBeInTheDocument();
  });

  test("updates result count when filtering", async () => {
    render(<Users />);
    await waitForElementToBeRemoved(() => screen.getByTestId("loading-state"));

    expect(screen.getByTestId("result-count")).toHaveTextContent(
      "Found 4 users",
    );

    const ageInput = screen.getByTestId("age-input");
    fireEvent.change(ageInput, { target: { value: "30" } });

    expect(screen.getByTestId("result-count")).toHaveTextContent(
      "Found 2 users",
    );
  });

  test("clears search filter when input is cleared", async () => {
    render(<Users />);
    await waitForElementToBeRemoved(() => screen.getByTestId("loading-state"));

    const searchInput = screen.getByTestId("search-input") as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "Alice" } });
    expect(screen.getAllByTestId("user-card")).toHaveLength(1);

    fireEvent.change(searchInput, { target: { value: "" } });
    expect(screen.getAllByTestId("user-card")).toHaveLength(4);
  });

  test("displays filter section with correct inputs", async () => {
    render(<Users />);
    await waitForElementToBeRemoved(() => screen.getByTestId("loading-state"));

    expect(screen.getByTestId("filter-section")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("age-input")).toBeInTheDocument();
  });
});
