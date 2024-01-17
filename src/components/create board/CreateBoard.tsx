import { useForm } from "react-hook-form";
import { Button, Modal, TextInput } from "flowbite-react";
import { useDispatch } from "react-redux";
import { createNewField } from "../../reducer/addNewBoard";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { IGroup } from "../kanban/commonTypes";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import { Navigate, useNavigate } from "react-router-dom";
const CreateBoard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [boards, setBoards] = useState([]);
  const auth = useSelector((state) => state.auth.userDetails);
  const navigate = useNavigate();
  useEffect(() => {
    const userCardCollection = collection(db, auth || "");

    const q = query(userCardCollection);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const cities: IGroup[] = [];
        querySnapshot.forEach((doc) => {
          cities.push({ id: doc.id, ...doc.data() });
        });
        setBoards(cities);
        console.log("BOARDLAR", cities);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [auth]);

  const dispatch = useDispatch();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  return (
    <div className="flex gap-x-2">
      <div className="flex gap-x-2">
        {boards &&
          boards.map((board, index) => (
            <div
              key={index}
              onClick={() => {
                navigate(`/${board.id}`);
                console.log("BOARD İD", board.id);
              }}
              className="w-[272px] bg-[#800080] p-8 flex justify-center items-center rounded-lg text-slate-200 hover:bg-[#EE82EE] ease-linear duration-75"
            >
              {board.name}
            </div>
          ))}
      </div>
      <Button onClick={() => setOpenModal(true)}>Yeni Pano</Button>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <form
            onSubmit={handleSubmit((data) => {
              dispatch(createNewField(data));
              setOpenModal(false);
            })}
            className="text-center"
          >
            <TextInput
              autoFocus
              {...register("name", { required: true })}
              id="email"
              placeholder="Bir pano oluşturun"
              required
            />
            <div className="flex justify-center gap-4 mt-5">
              <Button color="failure" type="submit">
                {"Oluştur"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Vazgeç
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CreateBoard;
