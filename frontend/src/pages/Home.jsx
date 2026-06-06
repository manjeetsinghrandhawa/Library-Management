import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBookOpen,
  FiClock,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <section className="hero">
        <HeroSlider />
        <div className="hero-overlay" />

        <div className="hero-inner">
          <div className="hero-copy">
            <span className="hero-badge">
              <FiStar />
              Premium library experience
            </span>

            <h1>
              Discover, borrow, and manage books with a refined library experience.
            </h1>

            <p>
              Explore a polished digital library for readers, students, and administrators. Track loans, manage collections, and enjoy an immersive reading journey.
            </p>

            <div className="hero-actions">
              <Link to="/login" className="btn">
                Login
                <FiArrowRight />
              </Link>

              <Link to="/signup" className="btn btn-outline">
                Register
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat-card">
                <strong>10K+</strong>
                <span>Curated books and journals</span>
              </div>

              <div className="stat-card">
                <strong>24/7</strong>
                <span>Access from any device</span>
              </div>

              <div className="stat-card">
                <strong>Fast</strong>
                <span>Borrowing and return flow</span>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-note">
              <h3>
                <FiBookOpen />
                Smart library actions
              </h3>

              <p>
                Curated reading lists, real-time stock visibility, and effortless book discovery in a single elegant interface.
              </p>
            </div>

            <div className="hero-note">
              <h3>
                <FiTrendingUp />
                Built for growth
              </h3>

              <p>
                See more engagement, cleaner workflows, and better student experiences with an interface designed to feel premium.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-grid section-shell">
        <div className="feature-card">
          <div className="feature-icon">
            <FiBookOpen />
          </div>

          <h3>
            Thousands of books
          </h3>

          <p>
            Discover a curated collection built for readers, research, and growth.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <FiClock />
          </div>

          <h3>
            Fast borrow and return
          </h3>

          <p>
            Keep circulation moving with clean workflows and instant status updates.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <FiShield />
          </div>

          <h3>Fine tracking</h3>

          <p>
            Monitor overdue items and borrower history in a polished, approachable dashboard.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <FiUsers />
          </div>

          <h3>Admin control</h3>

          <p>
            Give staff clear visibility and a stronger command center for daily management.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;