import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  body: string;
};

function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch("https://dummyjson.com/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (posts.length === 0) {
    return <p>No posts available</p>;
  }

  return (
    <div>
      {posts.map((post: Post) => (
        <div key={post.id} data-testid="post-card">
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}

export default Posts;
