import { useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { toast } from "react-toastify";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const { mutateAsync: saveUserToDB } = useMutation({
    mutationFn: (userInfo) => {
      return axiosPublic.post("/users", userInfo);
    },
    onSuccess: ({ data }) => {
      if (data.insertedId) {
        toast.success(
          "Registration Successful. Wait for account Activation!!!!"
        );
      }
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    const userInfo = {
      ...data,
      totalBalance: 0,
      totalSendMoney: 0,
      totalCashIn: 0,
      totalCashOut: 0,
      role: "user",
      status: "pending",
    };
    console.table(userInfo);

    // post user to db
    await saveUserToDB(userInfo);
  };
  return (
    <div
      className="flex w-full max-w-md mx-auto overflow-hidden bg-white 
      rounded-lg shadow-lg lg:max-w-7xl h-[500px] mt-[50px] lg:mt-[200px]"
    >
      <div
        className="hidden bg-cover lg:block lg:w-1/2"
        style={{ backgroundImage: "url('/register.jpg')" }}
      ></div>

      <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
        <Helmet>
          <title>Register</title>
        </Helmet>
        <p className="mt-3 text-xl text-center text-black mb-4">
          Welcome back! Register To Continue
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[20px]">
          <div>
            <input
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full"
              required
              {...register("name")}
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Your Email"
              className="input input-bordered w-full"
              {...register("email")}
              required
            />
          </div>
          <div className="">
            <input
              type="tel"
              placeholder="Type Your Mobile Number"
              className="input input-bordered w-full"
              required
              {...register("mobile", {
                pattern: /^[0-9]{11}$/,
              })}
            />
          </div>
          <div className="">
            <input
              type="password"
              placeholder="Type Your Pin"
              className="input input-bordered w-full"
              required
              {...register("pin", {
                pattern: /^\d{5}$/,
                //   /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]).{6,}$/,
              })}
            />
          </div>
          {errors.pin ? (
            <span className="text-red-800 mt-1">
              Pin Should be 5 digit Number
            </span>
          ) : (
            ""
          )}
          <div>
            <input
              type="submit"
              value="Register"
              className="input input-bordered w-full bg-black text-white text-[22px] font-semibold font-playfair cursor-pointer"
            />
          </div>
        </form>
        <div className="space-x-5 text-center mt-2">
          <span className="text-[16px] text-[#131313] font-inter">
            Already Have an Account?
          </span>
          <span
            onClick={() => navigate("/login")}
            className="text-[18px] text-blue-600 font-semibold underline font-montserrat cursor-pointer"
          >
            Log in
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
