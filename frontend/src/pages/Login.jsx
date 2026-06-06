import Navbar from "../components/Navbar";
import Template from "../components/Template";

function Login() {
  return (
    <>
      <Navbar />

      <Template
        title="Welcome Back"
        description1="Login to access your library account."
        description2="Borrow books and track your reading journey."
        image="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        formType="login"
      />
    </>
  );
}

export default Login;