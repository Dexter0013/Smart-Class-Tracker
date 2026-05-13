import { useEffect, useState } from "react";

export function useCurrentUser() {
  const [username, setUsername] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "User");
  }, []);

  return { username, loading: !isClient };
}
