import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";

const SignUp = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      if(!name){
          setError("Name is required");
          return;
      }
      if(!validateEmail(email)){
          setError("Invalid email address");
          return;
      }

      if(!password){
          setError("Password is required");
          return;
      }

      //Signup Api call
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignup}>
            <h4 className="text-2xl mb-7">SignUp</h4>
            <input
              type="text"
              placeholder="Name"
              className="input-box"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />

            <input
              type="text"
              placeholder="Email"
              className="input-box"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="btn-primary">
              Login
            </button>

            <p className="mt-5 text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
