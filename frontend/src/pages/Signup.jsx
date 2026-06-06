import Navbar from "../components/Navbar";
import Template from "../components/Template";

function Signup() {
  return (
    <>
      <Navbar />

      <Template
        title="Create Account"
        description1="Join the library community."
        description2="Explore, borrow and learn every day."
        image="https://cdn-icons-png.flaticon.com/512/747/747376.png"
        formType="signup"
      />
    </>
  );
}

export default Signup;