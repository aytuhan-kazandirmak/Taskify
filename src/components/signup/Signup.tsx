import { Button, Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import "./signup.css";
import { createUserWithEmailAndPassword, auth } from "../../firebase/Firebase";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
type Inputs = {
  fullname: string;
  email: string;
  password1: string;
  password2: string;
};

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const navigate = useNavigate();
  const registerFunc = async (dataObj: Inputs): Promise<any> => {
    try {
      const data = await createUserWithEmailAndPassword(
        auth,
        dataObj.email,
        dataObj.password1
      );
      console.log(data);
      const update = await updateProfile(auth.currentUser!, {
        displayName: dataObj.fullname,
        photoURL: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
      });

      navigate("/login");
      return update;
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <div className="flex w-full h-screen justify-center items-center signup">
      <form
        onSubmit={handleSubmit((data) => {
          if (data.password1 === data.password2) {
            registerFunc(data);
          } else {
            console.log("Şifreler aynı değil");
          }
        })}
        className="flex max-w-md flex-col gap-4 w-1/4"
      >
        <div>
          <div className="mb-2 block">
            <Label className="text-slate-200" htmlFor="email2" value="İsim" />
          </div>
          <TextInput
            autoComplete="false"
            {...register("fullname")}
            id="fullname"
            type="text"
            placeholder="Aytuhan Kazandırmak"
            required
            shadow
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label className="text-slate-200" htmlFor="email2" value="Email" />
          </div>
          <TextInput
            autoComplete="false"
            {...register("email")}
            id="email2"
            type="email"
            placeholder="email@gmail.com"
            required
            shadow
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label
              className="text-slate-200"
              htmlFor="password2"
              value="Şifre"
            />
          </div>
          <TextInput
            autoComplete="false"
            {...register("password2")}
            id="password2"
            type="password"
            required
            placeholder="******"
            shadow
          />
          {errors.password2 && (
            <span className="text-white">Bu alan gerekli</span>
          )}
        </div>
        <div>
          <div className="mb-2 block">
            <Label
              className="text-slate-200"
              htmlFor="repeat-password"
              value="Şifrenizi tekrar giriniz"
            />
          </div>
          <TextInput
            autoComplete="false"
            {...register("password1")}
            id="repeat-password"
            type="password"
            placeholder="******"
            required
            shadow
          />
        </div>
        <div className="flex items-center gap-2"></div>
        <Button type="submit">Kayıt ol</Button>
      </form>
    </div>
  );
};

export default Signup;
