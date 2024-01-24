import { useForm } from "react-hook-form";
import { Button, Modal, TextInput } from "flowbite-react";
import { useDispatch } from "react-redux";
import { createNewField } from "../../reducer/addNewBoard";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { IGroup } from "../kanban/commonTypes";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import MemberModal from "../member modal/MemberModal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const CreateBoard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [addMember, setAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  console.log("asdasdasdasdasdasd", memberEmail);
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
  console.log("DATAAAAA", addMember);
  const removeBoard = async (boardId) => {
    const listCollection = collection(db, auth || "");
    const listRef = doc(listCollection, boardId);
    await deleteDoc(listRef);
  };
  // const addNewMember = async (boardId) => {
  //   const boardCollection = collection(db, auth || "");
  //   const listRef = doc(boardCollection, boardId);
  //   const addMember = await updateDoc(listRef, {
  //     member: memberEmail.email,
  //   });
  //   return addMember;
  // };

  const dispatch = useDispatch();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, openModal]);
  return (
    <div className="flex p-4">
      <div className="flex  gap-8 flex-wrap ">
        <Button
          className="w-[272px] h-[88px]"
          onClick={() => setOpenModal(true)}
        >
          Yeni Pano
        </Button>
        {boards &&
          boards.map((board, index) => (
            <div
              key={index}
              className="w-[272px] bg-[#800080]  flex rounded-lg text-slate-200  ease-linear duration-75"
            >
              <div
                onClick={() => {
                  navigate(`/${board.id}`);
                  console.log("BOARD İD", board.id);
                }}
                className="board flex justify-center p-8 items-center h-full w-[85%] cursor-pointer rounded-l-lg"
              >
                {board.name}
              </div>
              <div className=" w-[15%] flex justify-end items-start">
                <div className="rounded-md p-2">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="rounded-md  p-2 text-sm font-semibold text-gray-900 shadow-sm ring-inset  hover:bg-[#EE82EE]">
                        <BsThreeDotsVertical size={20} />
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <span
                                onClick={() => {
                                  // addNewMember(board.id);
                                  setAddMember(true);
                                  console.log("board iddddddd", board.id);
                                }}
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm cursor-pointer"
                                )}
                              >
                                Üye Ekle
                              </span>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <span
                                onClick={() => {
                                  removeBoard(board.id);
                                  console.log("BOOOOARD İD", board.id);
                                }}
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm cursor-pointer"
                                )}
                              >
                                Sil
                              </span>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
              {addMember && (
                <MemberModal
                  board={board}
                  setMemberEmail={setMemberEmail}
                  setAddMember={setAddMember}
                  addMember={addMember}
                />
              )}
            </div>
          ))}
      </div>
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
            {errors.name && <span>This field is required</span>}
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