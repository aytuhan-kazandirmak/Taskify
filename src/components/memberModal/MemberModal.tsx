import { Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { addNewMember } from "../../reducer/addNewBoard";
import { useDispatch } from "react-redux";
import { Flowbite } from "flowbite-react";
import type { CustomFlowbiteTheme } from "flowbite-react";
import { IBoard } from "../group/GroupBoards";
const customTheme: CustomFlowbiteTheme = {
  modal: {
    content: {
      inner:
        "relative rounded-lg bg-zinc-900 shadow dark:bg-gray-700 flex flex-col max-h-[90vh]",
    },
  },
};
type IMemberModalProps = {
  setAddMember: React.Dispatch<React.SetStateAction<boolean>>;
  addMember: boolean;
  board: IBoard;
  currentBoardId: string;
};

const MemberModal: React.FC<IMemberModalProps> = ({
  setAddMember,
  addMember,
  board,
  currentBoardId,
}) => {
  const dispatch = useDispatch();
  console.log("BOAAAAAAAAAAAAARD", board);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, addMember]);
  return (
    <Flowbite theme={{ theme: customTheme }}>
      <Modal
        show={addMember}
        size="md"
        onClose={() => setAddMember(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <form
            className="text-center"
            onSubmit={handleSubmit((data) => {
              dispatch(
                addNewMember({ email: data.email, boardId: currentBoardId })
              );
              console.log("SELAAAAAAAAAAAAAAAM", data);
              setAddMember(false);
            })}
          >
            <TextInput
              {...register("email", { required: true })}
              style={{
                backgroundColor: "black",
                outline: "none",
                color: "#fff",
                border: "1px solid gray",
              }}
              id="email"
              type="email"
              placeholder="name@company.com"
              required
            />
            {errors.email && <span>This field is required</span>}
            <div className="flex justify-center gap-4 mt-5">
              <Button type="submit" className="bg-[#2e2e2e] hover:bg-zinc-900">
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setAddMember(false)}>
                No, cancel
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Flowbite>
  );
};
export default MemberModal;
