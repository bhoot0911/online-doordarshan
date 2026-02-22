import Link from "next/link";
import Navbar from "@/components/Navbar";
import ChatbotIcon from "@/components/ChatbotIcon";

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="hero">
        <div className="hero-content">
          <h1>
            Discover Your Next <span className="highlight">Favorite</span> Movie
          </h1>
          <p>
            AI-powered recommendations tailored to your cinematic taste, powered
            by a real SVD machine learning model.
          </p>
          <Link href="/dashboard">
            <button className="cta-btn">
              <i className="fas fa-play"></i> Start Exploring
            </button>
          </Link>
        </div>
      </section>
      <ChatbotIcon />
    </>
  );
}
