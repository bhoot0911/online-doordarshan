import Navbar from "@/components/Navbar";
import ChatbotIcon from "@/components/ChatbotIcon";

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <section className="about-page">
                <div className="about-card">
                    <h2>About Online Doordarshan</h2>
                    <p>
                        Online Doordarshan is an AI-powered movie recommendation platform
                        built with a real SVD (Singular Value Decomposition) machine
                        learning model. It analyzes latent factors from user ratings to
                        surface movies you will love.
                    </p>
                    <div className="about-features">
                        <div className="about-feature">
                            <span className="about-feature-icon" style={{ color: "#7c4dff" }}>
                                <i className="fas fa-brain"></i>
                            </span>
                            <span>SVD AI Engine</span>
                        </div>
                        <div className="about-feature">
                            <span className="about-feature-icon" style={{ color: "#00e5ff" }}>
                                <i className="fas fa-bolt"></i>
                            </span>
                            <span>Instant Results</span>
                        </div>
                        <div className="about-feature">
                            <span className="about-feature-icon" style={{ color: "#7c4dff" }}>
                                <i className="fas fa-mobile-alt"></i>
                            </span>
                            <span>Fully Responsive</span>
                        </div>
                    </div>
                </div>
            </section>
            <ChatbotIcon />
        </>
    );
}
