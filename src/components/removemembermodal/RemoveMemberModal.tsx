import { collection, doc, updateDoc } from "firebase/firestore";
import { Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { db } from "../../firebase/Firebase";
import { IBoard } from "../group/GroupBoards";
type IProps = {
  setModalRemove: React.Dispatch<React.SetStateAction<boolean>>;
  modalRemove: boolean;
  removeMemberBoardId: string;
  groupBoards: IBoard[];
};

const RemoveMemberModal: React.FC<IProps> = ({
  setModalRemove,
  modalRemove,
  removeMemberBoardId,
  groupBoards,
}) => {
  const removeMember: (data: string) => Promise<void>[] | undefined = (
    data
  ) => {
    console.log("silinecek üyü bilgileri", data);
    try {
      const removeMemberCollection = collection(db, "group-boards");
      const selectRemoveMemberModal = doc(
        removeMemberCollection,
        removeMemberBoardId
      );
      const updateMembers = groupBoards.map(async (items) => {
        console.log("ELEMANLAR", items);
        if (items.id === removeMemberBoardId) {
          const members = items.member;
          const newMembers = members?.filter((member) => member !== data);
          console.log("üye silindi kalan üyeler", newMembers);
          const updateFirebaseMembers = await updateDoc(
            selectRemoveMemberModal,
            {
              member: newMembers,
            }
          );
          return updateFirebaseMembers;
        }
      });
      console.log("Üye Silindi");
      return updateMembers;
    } catch (error) {
      console.log("ERROR", error);
    }
  };
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, modalRemove]);
  return (
    <>
      <Modal
        show={modalRemove}
        size="md"
        onClose={() => setModalRemove(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <form
            className="text-center"
            onSubmit={handleSubmit((data) => {
              removeMember(data.email);
              setModalRemove(false);
            })}
          >
            <TextInput
              {...register("email", { required: true })}
              id="email"
              type="email"
              style={{
                backgroundColor: "black",
                outline: "none",
                color: "#fff",
                border: "1px solid gray",
              }}
              placeholder="Silinecek üyenin email adresini giriniz"
              required
            />
            {errors.email && (
              <span className="text-white">Bu alan gerekli</span>
            )}
            <div className="flex justify-center gap-4 mt-5">
              <Button type="submit" className="bg-[#2e2e2e] hover:bg-zinc-900">
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setModalRemove(false)}>
                No, cancel
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default RemoveMemberModal;
