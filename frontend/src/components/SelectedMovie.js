"use client";

const POSTERS = [
    "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600&auto=format&fit=crop",
];

function poster(id) {
    return POSTERS[Math.abs(id) % POSTERS.length];
}
function fakeRating(id) {
    return (6.5 + ((id * 7 + 3) % 30) / 10).toFixed(1);
}
function wikiUrl(title) {
    return `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ \(\d{4}\)$/, ""))}`;
}

export default function SelectedMovie({ movie }) {
    const rating = fakeRating(movie.id);

    return (
        <div className="selected-movie">
            <img src={poster(movie.id)} alt={movie.title} />
            <div className="selected-info">
                <div className="genre-tags">
                    {movie.genres.map((g) => (
                        <span key={g} className="genre-tag">{g}</span>
                    ))}
                </div>
                <h2>{movie.title}</h2>
                <div className="selected-rating">
                    <i className="fas fa-star"></i> {rating} / 10
                </div>
                <p className="selected-plot">
                    Recommendation powered by SVD latent-factor similarity from your trained model.
                </p>
                <button
                    className="cta-btn"
                    onClick={() => window.open(wikiUrl(movie.title), "_blank")}
                >
                    <i className="fab fa-wikipedia-w"></i> View on Wikipedia
                </button>
            </div>
        </div>
    );
}
