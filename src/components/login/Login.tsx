import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { signInWithEmailAndPassword, auth } from "../../firebase/Firebase";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { authActions } from "../../reducer/firebaseSlice";
import { login } from "../../reducer/firebaseSlice";
import { Dispatch } from "@reduxjs/toolkit";
type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch: Dispatch<any> = useDispatch();
  // const { login, logout } = authActions;
  const loginFunc = async (dataObj: Inputs): Promise<void> => {
    try {
      const data = await signInWithEmailAndPassword(
        auth,
        dataObj.email,
        dataObj.password
      );
      const userDetails = data.user;
      dispatch(login(userDetails));
      navigate("/");
    } catch (error: unknown) {
      console.log(error);
    }
  };
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<Inputs>();
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);
  return (
    <div className="flex w-full h-screen justify-center items-center bg-lime-300">
      <form
        onSubmit={handleSubmit((data) => {
          loginFunc(data);
        })}
        className="flex max-w-md flex-col gap-4 w-1/4"
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1" value="Your email" />
          </div>
          <TextInput
            {...register("email")}
            id="email1"
            type="email"
            placeholder="name@flowbite.com"
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1" value="Your password" />
          </div>
          <TextInput
            {...register("password", { required: true })}
            id="password1"
            type="password"
            placeholder="********"
          />
          {errors.password && <span>This field is required</span>}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default Login;
