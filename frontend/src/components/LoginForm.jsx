import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";

function LoginForm() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response =
        await API.post(
          "/user/login",
          formData
        );

      const { token, user } =
        response.data;

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      toast.success(
        "Login Successful"
      );

      if (
        user.role === "ADMIN"
      ) {
        console.log("Navigating to admin dashboard");
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="auth-form"
      onSubmit={handleSubmit}
    >
      <label className="auth-field">
        <span>Email Address</span>

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>

      <label className="auth-field">
        <span>Password</span>

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </label>

      <button
        type="submit"
        className="auth-btn"
        disabled={loading}
      >
        {loading
          ? "Logging in..."
          : "Login"}
      </button>
    </form>
  );
}

export default LoginForm;