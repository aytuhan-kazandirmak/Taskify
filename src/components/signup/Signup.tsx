import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import "./signup.module.css";
import { createUserWithEmailAndPassword, auth } from "../../firebase/Firebase";
import { updateProfile } from "firebase/auth";
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

  const registerFunc = async (dataObj: Inputs): Promise<any> => {
    console.log(dataObj);
    try {
      const data = await createUserWithEmailAndPassword(
        auth,
        dataObj.email,
        dataObj.password1
      );
      console.log("auth nedir", auth);
      console.log(data);
      const update = await updateProfile(auth.currentUser!, {
        displayName: dataObj.fullname,
        photoURL: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
      });

      console.log("current user", auth.currentUser);
      return update;
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <div className="flex w-full h-screen justify-center items-center bg-lime-300">
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
            <Label htmlFor="email2" value="Your Fullname" />
          </div>
          <TextInput
            {...register("fullname")}
            id="fullname"
            type="text"
            placeholder="Jack Allison"
            required
            shadow
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email2" value="Your email" />
          </div>
          <TextInput
            {...register("email")}
            id="email2"
            type="email"
            placeholder="name@flowbite.com"
            required
            shadow
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password2" value="Your password" />
          </div>
          <TextInput
            {...register("password2")}
            id="password2"
            type="password"
            required
            shadow
          />
          {errors.password2 && <span>This field is required</span>}
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="repeat-password" value="Repeat password" />
          </div>
          <TextInput
            {...register("password1")}
            id="repeat-password"
            type="password"
            required
            shadow
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="agree" />
          <Label htmlFor="agree" className="flex">
            I agree with the&nbsp;
            <a
              href="#"
              className="text-cyan-600 hover:underline dark:text-cyan-500"
            >
              terms and conditions
            </a>
          </Label>
        </div>
        <Button type="submit">Register new account</Button>
      </form>
    </div>
  );
};

export default Signup;
