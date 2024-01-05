import { Button, Modal, Label, TextInput } from "flowbite-react";
import React, { useEffect } from "react";

type iProps = {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: boolean;
};
const CreateListModal: React.FC<iProps> = ({ setOpenModal, openModal }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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
            <div className="flex flex-col justify-center gap-4">
              <div>
                <div className="mb-2 block text-start">
                  <Label htmlFor="Başlık" value="Başlık" />
                </div>
                <TextInput
                  id="Baslik"
                  placeholder="Liste başlığı girin..."
                  required
                />
              </div>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={() => setOpenModal(false)}>
                  {"Listeye Ekle"}
                </Button>
                <Button color="gray" onClick={() => setOpenModal(false)}>
                  İptal
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateListModal;
