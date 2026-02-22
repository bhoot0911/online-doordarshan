<![CDATA[<div align="center">

# 🎬 Online Doordarshan

### AI-Powered Movie Recommendation Engine

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)

*Discover your next favorite movie with recommendations powered by a real SVD machine-learning model trained on the MovieLens dataset.*

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧠 **SVD Recommendation Engine** | Cosine-similarity on latent factors extracted by Singular Value Decomposition |
| ⚡ **Instant Results** | Pre-computed norms & indexed lookups deliver recommendations in milliseconds |
| 🎨 **Premium Dark UI** | Glassmorphism design with smooth animations and responsive layout |
| 🔍 **Live Search** | Type-ahead movie search with real-time matching |
| 🎭 **Genre Fallback** | Intelligent fallback to genre-based suggestions when a movie isn't in the training set |
| 📱 **Fully Responsive** | Works beautifully on desktop, tablet, and mobile |

---

## 🏗️ Architecture

```
┌──────────────────────┐        proxy /api/*        ┌──────────────────────┐
│                      │  ───────────────────────►   │                      │
│   Next.js Frontend   │        (rewrites)           │   FastAPI Backend    │
│   (Port 3000)        │                             │   (Port 8000)        │
│                      │  ◄───────────────────────   │                      │
│  • Landing Page      │        JSON response        │  • /api/recommend    │
│  • Dashboard         │                             │  • /api/search       │
│  • About Page        │                             │  • SVD Model (pkl)   │
└──────────────────────┘                             └──────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+** with `pip`
- **Node.js 18+** with `npm`
- MovieLens data files (see [Data Setup](#-data-setup))

### 1. Clone the repository

```bash
git clone https://github.com/bhoot0911/online-doordarshan.git
cd online-doordarshan
```

### 2. Install backend dependencies

```bash
pip install -r backend/requirements.txt
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Start both servers

**Terminal 1 — Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Open in browser

Navigate to **http://localhost:3000** and start exploring!

---

## 📂 Data Setup

This project requires two data files placed in the **project root** directory:

| File | Description | Source |
|------|-------------|--------|
| `movies.csv` | Movie titles and genres | [MovieLens](https://grouplens.org/datasets/movielens/) |
| `model_data.pkl` | Pre-trained SVD model (latent factors & mappings) | Generated from `recommender.ipynb` |

> **Note:** These files are excluded from the repository via `.gitignore` due to their size. Download the MovieLens dataset and run the training notebook to generate them.

---

## 📁 Project Structure

```
online-doordarshan/
├── backend/
│   ├── main.py                # FastAPI server with optimized recommendation engine
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js        # Landing page (hero section)
│   │   │   ├── dashboard/
│   │   │   │   └── page.js    # Recommendation dashboard with search
│   │   │   ├── about/
│   │   │   │   └── page.js    # About page
│   │   │   ├── layout.js      # Root layout with metadata
│   │   │   └── globals.css    # Complete design system
│   │   └── components/
│   │       ├── Navbar.js      # Navigation bar with active states
│   │       ├── MovieCard.js   # Recommendation card component
│   │       ├── SelectedMovie.js # Selected movie detail panel
│   │       ├── Loader.js      # Loading spinner
│   │       └── ChatbotIcon.js # Floating action button
│   ├── next.config.mjs        # Next.js config with API proxy rewrites
│   └── package.json
├── recommender.ipynb           # Model training notebook
├── .gitignore
└── README.md
```

---

## 🔧 API Endpoints

### `POST /api/recommend`

Get movie recommendations based on a search query.

**Request:**
```json
{
  "query": "Toy Story"
}
```

**Response:**
```json
{
  "selected": {
    "id": 1,
    "title": "Toy Story (1995)",
    "genres": ["Animation", "Children's", "Comedy"]
  },
  "recommendations": [
    {
      "id": 3114,
      "title": "Toy Story 2 (1999)",
      "genres": ["Animation", "Children's", "Comedy"]
    }
  ]
}
```

### `GET /api/search?q=<query>`

Search for movies by title (returns up to 8 matches).

---

## ⚙️ How It Works

1. **Training (offline):** An SVD model is trained on the MovieLens ratings dataset using the `surprise` library. The model learns latent factors (`qi` matrix) for each movie.

2. **Startup:** The FastAPI server loads the pre-trained model and pre-computes:
   - Norm vectors for all movies (avoids recomputation per request)
   - Movie ID → DataFrame row index (O(1) lookups)
   - Lowercased title column (faster search matching)

3. **Recommendation:** When a user searches for a movie:
   - The title is matched against the dataset
   - Cosine similarity is computed between the target movie's latent vector and all other movies
   - Top-10 most similar movies are returned

4. **Fallback:** If a movie isn't in the SVD training set, the system falls back to genre-based recommendations.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, Vanilla CSS |
| **Backend** | FastAPI, Uvicorn |
| **ML Model** | SVD (Singular Value Decomposition) via Surprise |
| **Data** | MovieLens dataset |
| **Styling** | Custom glassmorphism dark theme with Inter & Poppins fonts |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <b>Built with ❤️ by <a href="https://github.com/bhoot0911">bhoot0911</a></b>
</div>
]]>
