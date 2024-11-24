import { useState } from "react";

const Home = () => {
    const [username, setUsername] = useState("");
    const [repos, setRepos] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchRepos = async () => {
        setError(null);
        setRepos([]);

        try {
            const response = await fetch(`/api/repos?username=${username}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setRepos(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Next.js Circuit Breaker Demo</h1>
            <input
                type="text"
                placeholder="GitHub Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ padding: "8px", marginRight: "10px" }}
            />
            <button onClick={fetchRepos} style={{ padding: "8px 16px" }}>
                Fetch Repositories
            </button>

            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {repos.length > 0 && (
                <div>
                    <h3>Repositories:</h3>
                    <ul>
                        {repos.map((repo) => (
                            <li key={repo.name}>
                                <strong>{repo.name}</strong>: {repo.description}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Home;
