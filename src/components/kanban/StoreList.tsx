import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "flowbite-react";
import { IGroup } from "./commonTypes";
import "./StoreList.css";
import { useEffect, useState } from "react";
import { Textarea } from "flowbite-react";
import { HiOutlinePlus } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addNewCard } from "../../reducer/addNewCard";
type Inputs = {
  name: string[];
};
function StoreList({ name, items, id }: IGroup) {
  const dispatch = useDispatch();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<Inputs>();
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);
  const [createCard, setCreateCard] = useState(false);
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <div className="store-container ">
            <h3>{name}</h3>
          </div>
          <div className="items-container">
            {items &&
              items.map((item, index) => (
                <Draggable draggableId={item.id} index={index} key={item.id}>
                  {(provided) => (
                    <div
                      className="item-container"
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                    >
                      <h4>{item.name}</h4>
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
            {createCard ? (
              <form
                onSubmit={handleSubmit((data) => {
                  dispatch(addNewCard({ ...data, parentId: id }));
                })}
              >
                <div className="input-container">
                  <Textarea
                    {...register("name", { required: true })}
                    className="create-card bg-[rgb(255, 176, 189)] border-none"
                    autoFocus
                    required
                    rows={2}
                    placeholder="Bu kart için başlık girin..."
                  ></Textarea>
                  {errors.name && <span>This field is required</span>}
                </div>
                <div className="flex justify-start gap-4">
                  <Button
                    type="submit"
                    onClick={() => {}}
                    size="sm"
                    gradientMonochrome="failure"
                  >
                    Kart Ekle
                  </Button>
                  <Button
                    color="gray"
                    onClick={() => {
                      setCreateCard(false);
                    }}
                  >
                    Kapat
                  </Button>
                </div>
              </form>
            ) : (
              <div
                onClick={() => {
                  setCreateCard(true);
                }}
                className="new-card flex justify-between items-center"
              >
                <div>Kart ekle</div>
                <HiOutlinePlus />
              </div>
            )}
          </div>
        </div>
      )}
    </Droppable>
  );
}
export default StoreList;
