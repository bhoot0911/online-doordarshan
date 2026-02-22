"use client";
export default function ChatbotIcon() {
    return (
        <button
            className="chatbot-fab"
            onClick={() =>
                alert("Online Doordarshan Assistant: How can I help you find your next movie?")
            }
            aria-label="Chat"
        >
            <i className="fas fa-comment-dots"></i>
        </button>
    );
}
