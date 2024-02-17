import { Button, Label, TextInput } from "flowbite-react";
import { signInWithEmailAndPassword, auth } from "../../firebase/Firebase";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// import { authActions } from "../../reducer/firebaseSlice";
import { login, logout } from "../../reducer/firebaseSlice";
import { Dispatch } from "@reduxjs/toolkit";
import "./login.css";
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
      if (userDetails) {
        dispatch(login(userDetails.email));
        navigate("/");
      } else {
        dispatch(logout(undefined));
      }
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
    <div className="flex w-full h-screen justify-center items-center login">
      <form
        onSubmit={handleSubmit((data) => {
          loginFunc(data);
        })}
        className="flex max-w-md flex-col gap-4 w-1/4"
      >
        <div>
          <div className="mb-2 block">
            <Label className="text-slate-200" htmlFor="email1" value="Email" />
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
            <Label
              className="text-slate-200"
              htmlFor="password1"
              value="Şifre"
            />
          </div>
          <TextInput
            {...register("password", { required: true })}
            id="password1"
            type="password"
            placeholder="********"
          />
          {errors.password && (
            <span className="text-white">Bu alan gerekli...</span>
          )}
        </div>
        <div className="flex items-center gap-2"></div>
        <Button type="submit">Giriş yap</Button>

        <Link to={"/signup"}>
          <Button className="w-full">Kayıt ol</Button>
        </Link>
      </form>
    </div>
  );
};

export default Login;
