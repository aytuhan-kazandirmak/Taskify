import { Droppable, Draggable, DraggableProvided } from "react-beautiful-dnd";
import { Button } from "flowbite-react";
import { IGroup, IItem } from "./commonTypes";
import "./StoreList.css";
import { useEffect, useState } from "react";
import { Textarea } from "flowbite-react";
import { HiOutlinePlus } from "react-icons/hi";
import { AiFillDelete } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addNewCard } from "../../reducer/addNewCard";

type Inputs = {
  name: string;
};

interface StoreListProps extends IGroup {}

const StoreList: React.FC<StoreListProps> = ({
  name,
  items,
  id,
  index,
  removeCard,
  removeList,
  params,
}) => {
  // const newItems = items.sort((a, b) => a.position - b.position);

  const dispatch = useDispatch();
  console.log("STORELİST PARAMS", params);
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

  const handleCreateCard = () => {
    setCreateCard(true);
  };

  const handleCancelCreateCard = () => {
    setCreateCard(false);
  };

  const handleAddCard: SubmitHandler<Inputs> = (data) => {
    console.log("DATAAAAAAAAAAAAAAAAAA", data);
    dispatch(addNewCard({ ...data, parentId: id, boardId: params }));
  };

  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <div className="store-container flex justify-between items-center ">
            <h3>{name}</h3>
            <div
              onClick={() => {
                removeList(id);
              }}
              className="cursor-pointer"
            >
              <AiFillDelete size={24} />
            </div>
          </div>
          <div className="items-container">
            {items &&
              items.map((item: IItem, index: number) => (
                <Draggable draggableId={item.id} index={index} key={item.id}>
                  {(provided: DraggableProvided) => (
                    <div
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                    >
                      <div className="item-container">
                        <h4 className="w-5/6">{item.name}</h4>
                        <div
                          onClick={() => {
                            removeCard(id, index, item.id);
                          }}
                          className="p-2 cursor-pointer text-center flex items-center"
                        >
                          <AiFillDelete size={24} />
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
            {createCard ? (
              <form onSubmit={handleSubmit(handleAddCard)}>
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
                  <button
                    type="submit"
                    onClick={() => {}}
                    size="sm"
                    gradientMonochrome="failure"
                  >
                    Kart Ekle
                  </button>
                  <button color="gray" onClick={handleCancelCreateCard}>
                    Kapat
                  </button>
                </div>
              </form>
            ) : (
              <div
                onClick={handleCreateCard}
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
};

export default StoreList;
