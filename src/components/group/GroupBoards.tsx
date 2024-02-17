import {
  Button,
  CustomFlowbiteTheme,
  Flowbite,
  Modal,
  TextInput,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addGroupBoard } from "../../reducer/addNewGroupSlice";
import { GoPlus } from "react-icons/go";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import "./groupBoards.css";

import RemoveMemberModal from "../removemembermodal/RemoveMemberModal";
import { RootState } from "../../reducer/store";
import DetailsModal from "../boarddetails/DetailsModal";
import MemberModal from "../memberModal/MemberModal";

export type IBoard = {
  created: string;
  entryDateDay?: number;
  entryDateHour?: number;
  entryDateMinute?: number;
  entryDateMonth?: number;
  entryDateSecond?: number;
  entryDateYear?: number;
  id: string;
  member?: string[];
  name: string;
};
export type IDetails = {
  name: string;
  created: string;
};
const customTheme: CustomFlowbiteTheme = {
  modal: {
    content: {
      inner:
        "relative rounded-lg bg-zinc-900 shadow dark:bg-gray-700 flex flex-col max-h-[90vh]",
    },
  },
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
const GroupBoards: React.FC = () => {
  const [addMember, setAddMember] = useState<boolean>(false);
  const [currentBoardId, setCurrentBoardId] = useState<string>("");
  const [modalRemove, setModalRemove] = useState<boolean>(false);
  const [removeMemberBoardId, setRemoveMemberBoardId] = useState<string>("");
  const [openDetailsModal, setOpenDetailsModal] = useState<boolean>(false);
  const [detailsModal, setDetailsModal] = useState<IDetails | undefined>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [groupBoards, setGroupBoards] = useState<IBoard[]>([]);
  const auth = useSelector((state: RootState) => state.auth.userDetails);
  const navigate = useNavigate();
  useEffect(() => {
    const userCardCollection = collection(db, "group-boards");

    const q = query(userCardCollection);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const cities: IBoard[] = [];
        querySnapshot.forEach((doc) => {
          const member = doc.data().member;
          const controlll =
            member && member.some((item: string) => item.includes(auth));

          if (doc.data().created === auth || controlll) {
            cities.push({ id: doc.id, ...doc.data() } as IBoard);
          }
        });
        setGroupBoards(cities);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [auth]);
  const updateClickDate = async (boardId: string) => {
    try {
      const updateDateCollection = collection(db, "group-boards");
      const date = new Date();
      console.log("tarih- gün", date.getDay());
      const selectupdateDateCollection = doc(updateDateCollection, boardId);
      const update = await updateDoc(selectupdateDateCollection, {
        entryDateYear: date.getFullYear(),
        entryDateMonth: date.getMonth(),
        entryDateDay: date.getDay(),
        entryDateHour: date.getHours(),
        entryDateMinute: date.getMinutes(),
        entryDateSecond: date.getSeconds(),
      });
      return update;
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const removeBoard = async (boardId: string) => {
    const listCollection = collection(db, "group-boards");
    const listRef = doc(listCollection, boardId);
    await deleteDoc(listRef);
  };
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
      {modalRemove && (
        <RemoveMemberModal
          groupBoards={groupBoards}
          removeMemberBoardId={removeMemberBoardId}
          setModalRemove={setModalRemove}
          modalRemove={modalRemove}
        />
      )}
      <div className="flex gap-7 flex-wrap">
        <button
          className="w-[272px] h-[178px] new-board text-slate-200 bg-zinc-800 rounded-lg flex items-center gap-x-2 justify-center"
          onClick={() => setOpenModal(true)}
        >
          <div>Yeni Pano</div>
          <GoPlus size={22} />
        </button>
        {groupBoards &&
          groupBoards.map((board: IBoard, index) => (
            <div
              key={index}
              className="w-[272px] h-[178px] bg-zinc-800  flex rounded-lg text-slate-200  ease-linear duration-75"
            >
              <div
                onClick={() => {
                  navigate(`/groupboard/${board.id}`);
                  updateClickDate(board.id);
                  console.log("BOARD İD", board.id);
                }}
                className="board flex justify-center p-8 items-center h-full w-[85%] cursor-pointer rounded-lg break-all"
              >
                {board.name}
              </div>
              <div className=" w-[15%] flex justify-end items-start">
                <div className="rounded-md p-2">
                  <Menu as="div" className="relative inline-block text-left ">
                    <div>
                      <Menu.Button className="rounded-md  p-2 text-sm font-semibold text-gray-200 shadow-sm ring-inset  hover:bg-zinc-600">
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
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md  bg-zinc-600 shadow-lg ring-1 ring-zinc-200 ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <span
                                onClick={() => {
                                  setAddMember(true);
                                  setCurrentBoardId(board.id);
                                }}
                                className={classNames(
                                  active
                                    ? "bg-zinc-500 font-medium"
                                    : "text-zinc-300",
                                  "block px-4 py-2 text-sm cursor-pointer font-medium"
                                )}
                              >
                                Üye Ekle
                              </span>
                            )}
                          </Menu.Item>
                          {board.created === auth && (
                            <Menu.Item>
                              {({ active }) => (
                                <span
                                  onClick={() => {
                                    setRemoveMemberBoardId(board.id);
                                    setModalRemove(true);
                                  }}
                                  className={classNames(
                                    active
                                      ? "bg-zinc-500 font-medium"
                                      : "text-zinc-300",
                                    "block px-4 py-2 text-sm cursor-pointer font-medium"
                                  )}
                                >
                                  Üye Sil
                                </span>
                              )}
                            </Menu.Item>
                          )}
                          {board.created === auth && (
                            <Menu.Item>
                              {({ active }) => (
                                <span
                                  onClick={() => {
                                    console.log("BOOOOARD İD", board.id);
                                    removeBoard(board.id);
                                  }}
                                  className={classNames(
                                    active
                                      ? "bg-zinc-500 font-medium"
                                      : "text-zinc-300",
                                    "block px-4 py-2 text-sm cursor-pointer font-medium"
                                  )}
                                >
                                  Sil
                                </span>
                              )}
                            </Menu.Item>
                          )}

                          <Menu.Item>
                            {({ active }) => (
                              <span
                                onClick={() => {
                                  setOpenDetailsModal(true);
                                  console.log("ayrıntılıar", board);
                                  setDetailsModal({
                                    name: board.name,
                                    created: board.created,
                                  });
                                }}
                                className={classNames(
                                  active
                                    ? "bg-zinc-500 font-medium"
                                    : "text-zinc-300",
                                  "block px-4 py-2 text-sm cursor-pointer font-medium"
                                )}
                              >
                                Ayrıntılar
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
                  currentBoardId={currentBoardId}
                  board={board}
                  setAddMember={setAddMember}
                  addMember={addMember}
                />
              )}
              {openDetailsModal && (
                <DetailsModal
                  detailsModal={detailsModal}
                  setOpenDetailsModal={setOpenDetailsModal}
                  openDetailsModal={openDetailsModal}
                />
              )}
            </div>
          ))}
      </div>
      <Flowbite theme={{ theme: customTheme }}>
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
                setOpenModal(false);
                dispatch(addGroupBoard(data));
              })}
              className="text-center"
            >
              <TextInput
                autoFocus
                style={{
                  backgroundColor: "black",
                  outline: "none",
                  color: "#fff",
                  border: "1px solid gray",
                }}
                {...register("name", { required: true })}
                id="email"
                placeholder="Bir pano oluşturun"
                required
              />
              {errors.name && <span>Bu alan gerekli...</span>}
              <div className="flex justify-center gap-4 mt-5">
                <Button
                  className="bg-[#2e2e2e] hover:bg-zinc-900 "
                  type="submit"
                >
                  {"Oluştur"}
                </Button>
                <Button color="gray" onClick={() => setOpenModal(false)}>
                  Vazgeç
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </Flowbite>
    </div>
  );
};

export default GroupBoards;
