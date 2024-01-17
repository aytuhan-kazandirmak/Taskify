import { Button, Modal, Label, TextInput } from "flowbite-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createNewList } from "../../reducer/ProviderSlice";
import { Dispatch } from "redux";
import { getBoardId } from "../../reducer/ProviderSlice";

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

const CreateListModal: React.FC<iProps> = ({
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
  console.log("CREATELİSTMODAL", params);
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
                dispatch(createNewList({ ...data, boardId: params }));

                setOpenModal(false);
              })}
              className="flex flex-col justify-center gap-4"
            >
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password1" value="Your password" />
                </div>
                <TextInput
                  {...register("name", { required: true })}
                  id="name"
                  type="name"
                  autoFocus
                  placeholder="Liste başlığı girin..."
                />
                {errors.name && <span>This field is required</span>}
              </div>
              <Button type="submit">Listeye Ekle</Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateListModal;
