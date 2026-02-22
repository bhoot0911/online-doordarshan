// ── Constants ───────────────────────────────────────────────────────
const API_BASE = 'http://localhost:5000';

// Poster placeholders — curated Unsplash images for visual richness
const POSTERS = [
    'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1472457897821-70d3819a0e24?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop'
];

function randomPoster(seed) {
    return POSTERS[Math.abs(seed) % POSTERS.length];
}

function fakeRating(seed) {
    // Deterministic "rating" between 6.5 and 9.5 based on movie id
    return (6.5 + ((seed * 7 + 3) % 30) / 10).toFixed(1);
}

// ── Navigation ──────────────────────────────────────────────────────
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

function navigateTo(pageId) {
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) link.classList.add('active');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        navigateTo(link.dataset.page);
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// ── DOM References ──────────────────────────────────────────────────
const searchInput = document.getElementById('movieSearch');
const movieGrid = document.getElementById('movieGrid');
const selectedBox = document.getElementById('selectedMovie');
const loader = document.getElementById('loader');

// ── Search handler ──────────────────────────────────────────────────
searchInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        const q = searchInput.value.trim();
        if (q) fetchRecommendations(q);
    }
});

async function fetchRecommendations(query) {
    // Show loader
    movieGrid.style.opacity = '0';
    loader.style.display = 'flex';
    selectedBox.style.display = 'none';

    try {
        const res = await fetch(`${API_BASE}/recommend`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const data = await res.json();

        if (data.selected) {
            showSelectedMovie(data.selected);
            renderGrid(data.recommendations);
        } else {
            selectedBox.style.display = 'none';
            movieGrid.innerHTML = `
                <p style="text-align:center; grid-column:1/-1; color:var(--text-muted)">
                    No movies matched "<strong>${query}</strong>". Try another title.
                </p>`;
        }
    } catch (err) {
        console.error('Fetch error:', err);
        movieGrid.innerHTML = `
            <p style="text-align:center; grid-column:1/-1; color:#ff5252">
                ⚠ Could not reach MovieMind engine.<br>
                Make sure the backend is running: <code>.venv\\Scripts\\python app.py</code>
            </p>`;
    } finally {
        loader.style.display = 'none';
        movieGrid.style.opacity = '1';
        movieGrid.style.animation = 'fadeIn 0.5s ease forwards';
    }
}

// ── Render selected movie ───────────────────────────────────────────
function showSelectedMovie(movie) {
    const poster = randomPoster(movie.id);
    const rating = fakeRating(movie.id);
    const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(movie.title.replace(/ \(\d{4}\)$/, ''))}`;

    selectedBox.style.display = 'block';
    selectedBox.innerHTML = `
        <div class="glass-card selected-movie-card">
            <img src="${poster}" alt="${movie.title}" style="width:100%">
            <div class="selected-info">
                <div class="genre-tags">
                    ${movie.genres.map(g => `<span class="genre-tag">${g}</span>`).join('')}
                </div>
                <h2>${movie.title}</h2>
                <div style="color:#ffc107; margin-bottom:1rem;">
                    <i class="fas fa-star"></i> ${rating} / 10
                </div>
                <p class="plot" style="color:var(--text-muted)">
                    Recommendation powered by SVD latent-factor similarity from your trained model.
                </p>
                <button class="cta-button" onclick="window.open('${wikiUrl}', '_blank')">
                    <i class="fab fa-wikipedia-w"></i> View on Wikipedia
                </button>
            </div>
        </div>
        <h3 style="margin-top:3rem; margin-bottom:1.5rem; text-align:center;">
            Recommended for You
        </h3>
    `;
}

// ── Render recommendation grid ──────────────────────────────────────
function renderGrid(movies) {
    if (!movies || movies.length === 0) {
        movieGrid.innerHTML = `
            <p style="text-align:center; grid-column:1/-1; color:var(--text-muted)">
                No recommendations available for this title.
            </p>`;
        return;
    }

    movieGrid.innerHTML = movies.map(movie => {
        const poster = randomPoster(movie.id);
        const rating = fakeRating(movie.id);
        const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(movie.title.replace(/ \(\d{4}\)$/, ''))}`;

        return `
        <div class="glass-card movie-card" style="border-radius:16px; overflow:hidden"
             onclick="window.open('${wikiUrl}', '_blank')">
            <div class="rating-badge">
                <i class="fas fa-star" style="font-size:0.8rem"></i> ${rating}
            </div>
            <img src="${poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <div class="genre-tags">
                    ${movie.genres.slice(0, 3).map(g => `<span class="genre-tag">${g}</span>`).join('')}
                </div>
                <h3 class="movie-title">${movie.title}</h3>
                <button class="wiki-button">View on Wikipedia</button>
            </div>
        </div>`;
    }).join('');
}

// ── Chatbot mock ────────────────────────────────────────────────────
document.getElementById('chatToggle').addEventListener('click', () => {
    alert('MovieMind AI Assistant: How can I help you find your next movie?');
});

// ── Initial load (empty grid placeholder) ───────────────────────────
window.onload = () => {
    movieGrid.innerHTML = `
        <p style="text-align:center; grid-column:1/-1; color:var(--text-muted); padding:4rem 0">
            <i class="fas fa-film" style="font-size:3rem; display:block; margin-bottom:1rem; color:var(--purple-primary)"></i>
            Search for a movie above to get AI-powered recommendations
        </p>`;
};
