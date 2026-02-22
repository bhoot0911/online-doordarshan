from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle

app = Flask(__name__)
CORS(app)

# ── Load data on startup ────────────────────────────────────────────
print("Loading movies...")
movies_df = pd.read_csv('movies.csv')

print("Loading extracted SVD model data...")
with open('model_data.pkl', 'rb') as f:
    model_data = pickle.load(f)

qi = model_data['qi']                       # item latent factors  (n_items × n_factors)
raw2inner = model_data['raw2inner_id_items'] # movieId → inner index
inner2raw = model_data['inner2raw_id_items'] # inner index → movieId

print(f"Model ready: {qi.shape[0]} movies, {qi.shape[1]} factors")


# ── Similarity engine ───────────────────────────────────────────────
def get_similar_movies(movie_id, n=10):
    """Return top-n similar movies using cosine similarity on SVD latent factors."""
    if movie_id not in raw2inner:
        return []

    inner_id = raw2inner[movie_id]
    target_vec = qi[inner_id]

    # Cosine similarity against all items
    norms = np.linalg.norm(qi, axis=1)
    target_norm = np.linalg.norm(target_vec)
    similarities = np.dot(qi, target_vec) / (norms * target_norm + 1e-9)

    # Exclude self, get top-n
    ranked = np.argsort(similarities)[::-1]
    results = [idx for idx in ranked if idx != inner_id][:n]
    return results


# ── API endpoint ────────────────────────────────────────────────────
@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json or {}
    query = data.get('query', '').strip().lower()

    if not query:
        return jsonify({'selected': None, 'recommendations': []})

    # Find best matching movie by title substring
    mask = movies_df['title'].str.lower().str.contains(query, na=False)
    matched = movies_df[mask]

    if matched.empty:
        return jsonify({'selected': None, 'recommendations': []})

    sel = matched.iloc[0]
    movie_id = int(sel['movieId'])

    payload = {
        'selected': {
            'id': movie_id,
            'title': sel['title'],
            'genres': sel['genres'].split('|'),
        },
        'recommendations': []
    }

    # SVD-based recommendations
    similar_indices = get_similar_movies(movie_id)

    if similar_indices:
        for idx in similar_indices:
            raw_id = inner2raw[idx]
            row = movies_df[movies_df['movieId'] == raw_id]
            if not row.empty:
                r = row.iloc[0]
                payload['recommendations'].append({
                    'id': int(r['movieId']),
                    'title': r['title'],
                    'genres': r['genres'].split('|'),
                })
    else:
        # Fallback: genre-based if movie not in SVD training set
        primary_genre = sel['genres'].split('|')[0]
        fallback = movies_df[
            movies_df['genres'].str.contains(primary_genre, na=False)
            & (movies_df['movieId'] != movie_id)
        ].head(10)
        for _, r in fallback.iterrows():
            payload['recommendations'].append({
                'id': int(r['movieId']),
                'title': r['title'],
                'genres': r['genres'].split('|'),
            })

    return jsonify(payload)


# ── Search autocomplete endpoint ────────────────────────────────────
@app.route('/search', methods=['GET'])
def search():
    q = request.args.get('q', '').strip().lower()
    if len(q) < 2:
        return jsonify([])
    mask = movies_df['title'].str.lower().str.contains(q, na=False)
    results = movies_df[mask].head(8)[['movieId', 'title', 'genres']].to_dict('records')
    for r in results:
        r['genres'] = r['genres'].split('|')
    return jsonify(results)


if __name__ == '__main__':
    app.run(port=5000, debug=True)
