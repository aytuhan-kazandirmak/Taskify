import { Button, Modal, TextInput } from "flowbite-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { addNewMember } from "../../reducer/addNewBoard";
import { useDispatch } from "react-redux";
function MemberModal({ setAddMember, addMember, setMemberEmail, board }) {
  const dispatch = useDispatch();
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
    <>
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
              dispatch(addNewMember({ ...data, boardId: board.id }));
              setAddMember(false);
            })}
          >
            <TextInput
              {...register("email", { required: true })}
              id="email"
              type="email"
              placeholder="name@company.com"
              required
            />
            {errors.email && <span>This field is required</span>}
            <div className="flex justify-center gap-4 mt-5">
              <Button type="submit" color="failure">
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setAddMember(false)}>
                No, cancel
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default MemberModal;
