import { FC, FormEvent, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { FaUnlock } from "react-icons/fa";
import { RiLockPasswordFill, RiUser3Fill } from "react-icons/ri";
import { GiArchiveRegister } from "react-icons/gi";

const LoginModal: FC = () => {
  const [clicked, setClicked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(true); // controls modal visibility

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        alert("Invalid username or password");
        return;
      }

      const data = await res.json();
      alert(`Welcome ${data.user.username}!`);

      // Save token and user info for cart usage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);

      setOpen(false); // close modal
    } catch (err) {
      console.error(err);
      alert("Login failed, check console for details");
    }
  };

  if (!open) return null;

  return (
    <div className="bg-[#0000007d] w-full min-h-screen fixed inset-0 z-30 flex items-center justify-center font-karla">
      <div className="relative border shadow rounded p-8 bg-white max-w-md w-full z-40 dark:bg-slate-800 dark:text-white">
        <RxCross1
          className="absolute cursor-pointer right-5 top-5 hover:opacity-85"
          onClick={() => setOpen(false)}
        />
        {clicked ? (
          <>
            <div className="flex mb-2 space-x-2 justify-center items-center">
              <GiArchiveRegister />
              <h3 className="font-bold text-center text-xl">Register</h3>
              <GiArchiveRegister />
            </div>
            <p className="leading-4">
              Hobby project only. Use <b>atuny0</b> as username & <b>9uQFF1Lh</b> as password.{" "}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => setClicked(false)}
              >
                Go to login
              </span>
            </p>
          </>
        ) : (
          <>
            <div className="flex mb-2 space-x-2 justify-center items-center">
              <FaUnlock />
              <h3 className="font-bold text-center text-2xl">Login</h3>
              <FaUnlock />
            </div>
            <form onSubmit={submitForm} className="flex flex-col space-y-3">
              <div className="relative">
                <input
                  data-test="input-username"
                  type="text"
                  placeholder="Your username here... (atuny0)"
                  className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <RiUser3Fill className="absolute top-3 left-2 text-lg" />
              </div>
              <div className="relative">
                <input
                  data-test="input-password"
                  type="password"
                  placeholder="Your password here... (9uQFF1Lh)"
                  className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <RiLockPasswordFill className="absolute top-3 left-2 text-lg" />
              </div>
              <input
                data-test="input-submit"
                type="submit"
                value="Submit"
                className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 cursor-pointer"
              />
            </form>
            <p className="text-center mt-1">
              No Account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => setClicked(true)}
              >
                Register
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;