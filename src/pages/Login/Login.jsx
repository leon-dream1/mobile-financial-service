import { useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { toast } from "react-toastify";
// import { toast } from "react-toastify";

const Login = () => {
  const { register, handleSubmit, error } = useForm();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const { mutateAsync: logInUser } = useMutation({
    mutationFn: (userInfo) => {
      return axiosPublic.post("/login", userInfo);
    },
    onSuccess: ({ data }) => {
      console.log(data);
      if (data.status === 200) {
        toast.success(data.message);
        localStorage.setItem("email", data.email);

        axiosPublic.post("/jwt", { email: data.email }).then((res) => {
          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            navigate("/");
          }
        });
      } else {
        toast.error(data.message);
      }
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    await logInUser(data);
  };

  return (
    <div className="flex w-full max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-lg  lg:max-w-7xl h-[520px] mt-[50px] lg:mt-[200px]">
      <div
        className="hidden bg-cover lg:block lg:w-1/2"
        style={{ backgroundImage: "url('/login.jpg')" }}
      ></div>

      <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
        <Helmet>
          <title>Login</title>
        </Helmet>
        <h1 className="text-center text-[20px] md:text-[30px] lg:text-[40px] font-inter text-slate-700 font-medium mb-[15px]">
          Login To Get Service
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[20px]">
          <div>
            <input
              type="text"
              placeholder="Your Email / Phone Number"
              className="input input-bordered w-full"
              {...register("emailOrPhn")}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Type Your Pin"
              className="input input-bordered w-full"
              required
              {...register("pin")}
            />
          </div>
          {error ? <span className="text-red-700">{error}</span> : ""}
          <div>
            <input
              type="submit"
              value="Log in"
              className="input input-bordered w-full bg-black text-white text-[22px] font-semibold font-playfair cursor-pointer"
            />
          </div>
        </form>
        <div className="space-x-5 text-center mt-2">
          <span className="text-[16px] text-[#131313] font-inter">
            Do not have an Account?
          </span>
          <span
            onClick={() => navigate("/register")}
            className="text-[18px] text-blue-600 font-semibold underline font-open-sans cursor-pointer"
          >
            Register
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
