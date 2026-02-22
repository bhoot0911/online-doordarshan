"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import SelectedMovie from "@/components/SelectedMovie";
import Loader from "@/components/Loader";
import ChatbotIcon from "@/components/ChatbotIcon";

const API = "";

export default function DashboardPage() {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);

    async function handleSearch(e) {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setSelected(null);
        setRecommendations([]);
        setSearched(true);

        try {
            const res = await fetch(`${API}/api/recommend`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: query.trim() }),
            });
            const data = await res.json();

            if (data.selected) {
                setSelected(data.selected);
                setRecommendations(data.recommendations || []);
            } else {
                setError(`No movies matched "${query}". Try another title.`);
            }
        } catch {
            setError("Could not reach the recommendation engine. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar />
            <section className="dashboard">
                <h1 className="dashboard-title">Recommendation Dashboard</h1>
                <p className="dashboard-subtitle">
                    Search any movie and our SVD model will find similar ones
                </p>

                <form onSubmit={handleSearch}>
                    <div className="search-wrapper">
                        <i className="fas fa-search search-icon"></i>
                        <input
                            className="search-input"
                            type="text"
                            placeholder='Search for a movie (e.g., "Toy Story")...'
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button type="submit" className="search-btn">
                            Search
                        </button>
                    </div>
                </form>

                <div className="filters">
                    <select className="filter-select">
                        <option>All Genres</option>
                        <option>Action</option>
                        <option>Comedy</option>
                        <option>Drama</option>
                        <option>Sci-Fi</option>
                        <option>Thriller</option>
                    </select>
                    <select className="filter-select">
                        <option>Any Rating</option>
                        <option>High Rated (8.0+)</option>
                        <option>Medium (6.0-8.0)</option>
                    </select>
                </div>

                {/* Loading */}
                {loading && <Loader />}

                {/* Error */}
                {error && (
                    <div className="error-state">
                        <p>{error}</p>
                    </div>
                )}

                {/* Selected Movie */}
                {selected && <SelectedMovie movie={selected} />}

                {/* Recommendations */}
                {recommendations.length > 0 && (
                    <>
                        <h2 className="section-title">Recommended for You</h2>
                        <div className="movie-grid">
                            {recommendations.map((m) => (
                                <MovieCard key={m.id} movie={m} />
                            ))}
                        </div>
                    </>
                )}

                {/* Empty initial state */}
                {!searched && !loading && (
                    <div className="empty-state">
                        <span className="empty-icon">
                            <i className="fas fa-film"></i>
                        </span>
                        Search for a movie above to get AI-powered recommendations
                    </div>
                )}
            </section>
            <ChatbotIcon />
        </>
    );
}
