import { Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { addNewMember } from "../../reducer/addNewBoard";
import { useDispatch } from "react-redux";
import { Flowbite } from "flowbite-react";
import type { CustomFlowbiteTheme } from "flowbite-react";
import { IBoard } from "../group/GroupBoards";
import { AppDispatch } from "../../reducer/store";
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

  currentBoardId,
}) => {
  const dispatch: AppDispatch = useDispatch();

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
              autoComplete="false"
              id="email"
              type="email"
              placeholder="Eklenecek üyenin mail adresini giriniz..."
              required
            />
            {errors.email && <span>This field is required</span>}
            <div className="flex justify-center gap-4 mt-5">
              <Button type="submit" className="bg-[#2e2e2e] hover:bg-zinc-900">
                Ekle
              </Button>
              <Button color="gray" onClick={() => setAddMember(false)}>
                Vazgeç
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Flowbite>
  );
};
export default MemberModal;
