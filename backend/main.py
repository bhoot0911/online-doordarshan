from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import pickle
import os

# ── App setup ────────────────────────────────────────────────────────
app = FastAPI(title="Online Doordarshan API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load data on startup ────────────────────────────────────────────
BASE = os.path.dirname(os.path.abspath(__file__))
PARENT = os.path.dirname(BASE)

movies_df = pd.read_csv(os.path.join(PARENT, "movies.csv"))

with open(os.path.join(PARENT, "model_data.pkl"), "rb") as f:
    model_data = pickle.load(f)

qi         = model_data["qi"]                       # (n_items, n_factors)
raw2inner  = model_data["raw2inner_id_items"]       # movieId → inner idx
# inner2raw_id_items is None in pickle, so derive it by inverting raw2inner
inner2raw  = {v: k for k, v in raw2inner.items()}   # inner idx → movieId

# ── Pre-computed data for speed ──────────────────────────────────────
qi_norms = np.linalg.norm(qi, axis=1)               # pre-compute all norms once
movie_index = dict(zip(movies_df["movieId"], movies_df.index))  # movieId → row index for O(1) lookup

# Pre-lowercase titles for fast search
movies_df["_title_lower"] = movies_df["title"].str.lower()

print(f"Model loaded: {qi.shape[0]} movies, {qi.shape[1]} factors")


# ── Helpers ──────────────────────────────────────────────────────────
def cosine_similar(movie_id: int, n: int = 10):
    """Return inner indices of top-n similar movies via cosine similarity."""
    if movie_id not in raw2inner:
        return []
    iid = raw2inner[movie_id]
    vec = qi[iid]
    vec_norm = qi_norms[iid]
    sims = qi @ vec / (qi_norms * vec_norm + 1e-9)
    ranked = np.argsort(sims)[::-1]
    return [i for i in ranked if i != iid][:n]


def movie_row_to_dict(row):
    return {
        "id": int(row["movieId"]),
        "title": row["title"],
        "genres": row["genres"].split("|"),
    }


def get_movie_by_id(movie_id):
    """O(1) movie lookup by movieId using pre-built index."""
    idx = movie_index.get(movie_id)
    if idx is not None:
        return movies_df.iloc[idx]
    return None


# ── Schemas ──────────────────────────────────────────────────────────
class RecommendRequest(BaseModel):
    query: str


# ── Endpoints ────────────────────────────────────────────────────────
@app.post("/api/recommend")
def recommend(body: RecommendRequest):
    q = body.query.strip().lower()
    if not q:
        return {"selected": None, "recommendations": []}

    mask = movies_df["_title_lower"].str.contains(q, na=False, regex=False)
    matched = movies_df[mask]

    if matched.empty:
        return {"selected": None, "recommendations": []}

    sel = matched.iloc[0]
    mid = int(sel["movieId"])

    recs = []
    indices = cosine_similar(mid)

    if indices:
        for idx in indices:
            rid = inner2raw[idx]
            row = get_movie_by_id(rid)
            if row is not None:
                recs.append(movie_row_to_dict(row))
    else:
        # fallback: genre match
        pg = sel["genres"].split("|")[0]
        fb = movies_df[
            movies_df["genres"].str.contains(pg, na=False)
            & (movies_df["movieId"] != mid)
        ].head(10)
        recs = [movie_row_to_dict(r) for _, r in fb.iterrows()]

    return {"selected": movie_row_to_dict(sel), "recommendations": recs}


@app.get("/api/search")
def search(q: str = ""):
    q = q.strip().lower()
    if len(q) < 2:
        return []
    mask = movies_df["_title_lower"].str.contains(q, na=False, regex=False)
    hits = movies_df[mask].head(8)
    return [movie_row_to_dict(r) for _, r in hits.iterrows()]
