import { useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function SignupForm() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const submitHandler = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post(
        "/user/register",
        formData
      );

      toast.success(
        "Registration successful"
      );

      navigate("/login");
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="auth-form"
      onSubmit={submitHandler}
    >
      <label className="auth-field">
        <span>First Name</span>

        <input
          type="text"
          name="firstName"
          placeholder="First name"
          onChange={changeHandler}
          required
        />
      </label>

      <label className="auth-field">
        <span>Last Name</span>

        <input
          type="text"
          name="lastName"
          placeholder="Last name"
          onChange={changeHandler}
          required
        />
      </label>

      <label className="auth-field">
        <span>Email Address</span>

        <input
          type="email"
          name="email"
          placeholder="name@example.com"
          onChange={changeHandler}
          required
        />
      </label>

      <label className="auth-field">
        <span>Password</span>

        <input
          type="password"
          name="password"
          placeholder="Create a password"
          onChange={changeHandler}
          required
        />
      </label>

      <button
        className="auth-btn"
        disabled={loading}
      >
        {loading
          ? "Creating..."
          : "Create Account"}
      </button>
    </form>
  );
}

export default SignupForm;
