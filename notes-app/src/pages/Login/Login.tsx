import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { useState } from "react";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";

interface ILoginProps {
  email: string;
  password: string;

}
const Login = () => {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: ({ email, password }: ILoginProps  ) =>
      axiosInstance.post("/login", {
        email: email,
        password: password,
      }),
    onSuccess: (response) => {
      localStorage.setItem("token", response.data.accessToken);
      navigate("/dashboard");
    }
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }
    mutate({ email, password });

  };
  return (
    <div>
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <PasswordInput
              value={password}
              onChange={onChange}
              placeholder="Password"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="btn-primary">
              Login
            </button>

            <p className="mt-5 text-sm text-center">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-primary underline">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
