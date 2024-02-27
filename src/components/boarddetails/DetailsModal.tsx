import { Button, Modal } from "flowbite-react";
import { IDetails } from "../group/GroupBoards";
type IProps = {
  setOpenDetailsModal: React.Dispatch<React.SetStateAction<boolean>>;
  openDetailsModal: boolean;
  detailsModal: IDetails | undefined;
};
const DetailsModal: React.FC<IProps> = ({
  setOpenDetailsModal,
  openDetailsModal,
  detailsModal,
}) => {
  return (
    <>
      <Modal dismissible show={openDetailsModal}>
        <Modal.Body>
          <div className="space-y-6 pt-12">
            <p className="text-base leading-relaxed text-white dark:text-gray-400">
              Pano: {detailsModal?.name}
            </p>
            <p className="text-base leading-relaxed text-white dark:text-gray-400">
              Pano Sahibi: {detailsModal?.created}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button color="gray" onClick={() => setOpenDetailsModal(false)}>
            Kapat
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DetailsModal;
