import { Link, useNavigate } from "react-router-dom";
import { FiBookOpen, FiLogOut, FiUser } from "react-icons/fi";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <FiBookOpen />
          </span>

          <span className="brand-copy">
            LibraryMS
            <span>Elegant library portal</span>
          </span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-ghost">
            Home
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="nav-ghost">
                Login
              </Link>

              <Link to="/signup" className="nav-primary">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="nav-user">
                <FiUser />
                {user.firstName}
                <span className="dashboard-chip">
                  {user.role}
                </span>
              </span>

              <button
                onClick={logoutHandler}
                className="nav-primary"
              >
                <FiLogOut />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;