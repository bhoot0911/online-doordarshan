"use client";

const POSTERS = [
    "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1472457897821-70d3819a0e24?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop",
];

function poster(id) {
    return POSTERS[Math.abs(id) % POSTERS.length];
}

function fakeRating(id) {
    return (6.5 + ((id * 7 + 3) % 30) / 10).toFixed(1);
}

function wikiUrl(title) {
    const clean = title.replace(/ \(\d{4}\)$/, "");
    return `https://en.wikipedia.org/wiki/${encodeURIComponent(clean)}`;
}

export default function MovieCard({ movie }) {
    const rating = fakeRating(movie.id);

    return (
        <div
            className="movie-card"
            onClick={() => window.open(wikiUrl(movie.title), "_blank")}
        >
            <div className="poster-wrap">
                <img src={poster(movie.id)} alt={movie.title} />
                <div className="poster-overlay"></div>
            </div>
            <div className="rating-badge">
                <i className="fas fa-star" style={{ fontSize: "0.75rem" }}></i> {rating}
            </div>
            <div className="card-body">
                <div className="genre-tags">
                    {movie.genres.slice(0, 3).map((g) => (
                        <span key={g} className="genre-tag">
                            {g}
                        </span>
                    ))}
                </div>
                <h3 className="card-title">{movie.title}</h3>
                <button
                    className="wiki-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        window.open(wikiUrl(movie.title), "_blank");
                    }}
                >
                    View on Wikipedia
                </button>
            </div>
        </div>
    );
}
