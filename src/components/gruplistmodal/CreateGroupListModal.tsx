import { Button, Modal, Label, TextInput } from "flowbite-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createNewGroupList } from "../../reducer/ProviderGroupBoards";
import { Dispatch } from "redux";
type iProps = {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: boolean;
  params: Iparams;
};
type Iparams = {
  id: string;
};
type Inputs = {
  name: string;
};

const CreateGroupListModal: React.FC<iProps> = ({
  setOpenModal,
  openModal,
  params,
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  console.log("CREATELİSTMODAL", params.groupId);
  const dispatch: Dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  return (
    <>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <form
              onSubmit={handleSubmit((data) => {
                dispatch(
                  createNewGroupList({ ...data, boardId: params.groupId })
                );

                setOpenModal(false);
              })}
              className="flex flex-col justify-center gap-4"
            >
              <div>
                <div className="mb-2 block"></div>
                <TextInput
                  style={{
                    backgroundColor: "black",
                    outline: "none",
                    color: "#fff",
                    border: "1px solid gray",
                  }}
                  {...register("name", { required: true })}
                  id="name"
                  type="name"
                  autoFocus
                  placeholder="Liste başlığı girin..."
                />
                {errors.name && <span>This field is required</span>}
              </div>
              <Button type="submit" className="bg-[#2e2e2e] hover:bg-zinc-900 ">
                Listeye Ekle
              </Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateGroupListModal;
