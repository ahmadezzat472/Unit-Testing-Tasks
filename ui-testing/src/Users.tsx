import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  age: number;
};

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [minAge, setMinAge] = useState<number>(0);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch("https://dummyjson.com/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.users);
        setFilteredUsers(data.users);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  // Handle search and age filter
  const handleFilter = (search: string, age: number) => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesAge = user.age >= age;
      return matchesSearch && matchesAge;
    });
    setFilteredUsers(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleFilter(value, minAge);
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setMinAge(value);
    handleFilter(searchTerm, value);
  };

  if (loading) {
    return <p data-testid="loading-state">Loading users...</p>;
  }

  if (error) {
    return <p data-testid="error-state">{error}</p>;
  }

  if (users.length === 0) {
    return <p data-testid="empty-state">No users available</p>;
  }

  return (
    <div data-testid="users-container">
      <div data-testid="filter-section">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={handleSearchChange}
          data-testid="search-input"
        />
        <input
          type="number"
          placeholder="Minimum age"
          value={minAge}
          onChange={handleAgeChange}
          data-testid="age-input"
          min="0"
        />
      </div>
      {filteredUsers.length === 0 ? (
        <p data-testid="no-results">No users match your filters</p>
      ) : (
        <div>
          <p data-testid="result-count">Found {filteredUsers.length} users</p>
          {filteredUsers.map((user: User) => (
            <div key={user.id} data-testid="user-card">
              <h3>{user.name}</h3>
              <p>Email: {user.email}</p>
              <p>Age: {user.age}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Users;
