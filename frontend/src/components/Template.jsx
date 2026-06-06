import {
  FiBookOpen,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function Template({
  title,
  description1,
  description2,
  image,
  formType,
}) {
  const badges =
    formType === "login"
      ? [
          {
            title: "Instant access",
            text: "Return to your saved reading path in seconds.",
            icon: FiBookOpen,
          },
          {
            title: "Secure sign in",
            text: "A focused, frictionless login experience.",
            icon: FiShield,
          },
          {
            title: "Borrowing history",
            text: "Track current and past loans from one clean view.",
            icon: FiUsers,
          },
        ]
      : [
          {
            title: "Create your profile",
            text: "Join the library community with a polished onboarding flow.",
            icon: FiBookOpen,
          },
          {
            title: "Smart collections",
            text: "Search, save, and borrow from a richer catalog.",
            icon: FiShield,
          },
          {
            title: "Role-based access",
            text: "Students and admins land in the right workspace automatically.",
            icon: FiUsers,
          },
        ];

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <span className="auth-kicker">
            Library Management System
          </span>

          <h1>{title}</h1>

          <p className="auth-description">
            {description1}
            <br />
            <strong>{description2}</strong>
          </p>

          <div className="auth-badges">
            {badges.map((badge) => {
              const Icon = badge.icon;

              return (
                <div
                  key={badge.title}
                  className="auth-badge"
                >
                  <strong>
                    <Icon />
                    {badge.title}
                  </strong>

                  <span>{badge.text}</span>
                </div>
              );
            })}
          </div>

          {formType === "login" ? (
            <LoginForm />
          ) : (
            <SignupForm />
          )}
        </div>

        <div className="auth-right">
            <div className="auth-panel">
              <div className="auth-image">
                <img
                  src={image}
                  alt="authentication"
                />
              </div>

              <div className="auth-highlight">
                <h4>
                  Read. Learn. Grow.
                </h4>

                <p>
                  Access thousands of books, manage borrowing history, and enjoy a seamless library experience.
                </p>
              </div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default Template;