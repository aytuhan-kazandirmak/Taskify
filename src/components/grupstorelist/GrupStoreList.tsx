import { Droppable, Draggable, DraggableProvided } from "react-beautiful-dnd";
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { Textarea } from "flowbite-react";
import { HiOutlinePlus } from "react-icons/hi";
import { AiFillDelete } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addNewGroupCard } from "../../reducer/addNewGroupList";
import { IItem } from "../kanban/commonTypes";
import "./grupstorelist.css";

type Inputs = {
  name: string;
};
interface StoreListProps {
  name: string;
  items: IItem[];
  id: string;
  removeCard: (listId: string, cardId: string) => void;

  removeList: (listId: string) => Promise<void>;
  params?: string;
}
const GrupStoreList: React.FC<StoreListProps> = ({
  name,
  items,
  id,
  removeCard,
  removeList,
  params,
}) => {
  // const newItems = items.sort((a, b) => a.position - b.position);
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

  const handleCreateCard = () => {
    setCreateCard(true);
  };

  const handleCancelCreateCard = () => {
    setCreateCard(false);
  };

  const handleAddCard: SubmitHandler<Inputs> = (data) => {
    console.log("DATAAAAAAAAAAAAAAAAAA", {
      ...data,
      parentId: params,
      boardId: params,
    });
    dispatch(addNewGroupCard({ ...data, parentId: id, boardId: params }));
  };

  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <div className="store-container bg-zinc-800 text-gray-400 flex justify-between items-center ">
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
          <div className="items-container bg-zinc-800">
            {items &&
              items.map((item: IItem, index: number) => (
                <Draggable draggableId={item.id} index={index} key={item.id}>
                  {(provided: DraggableProvided) => (
                    <div
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                    >
                      <div className="item-container bg-zinc-600 hover:bg-zinc-400 text-gray-200">
                        <h4 className="w-5/6">{item.name}</h4>
                        <div
                          onClick={() => {
                            removeCard(id, item.id);
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
                    className="create-card bg-zinc-600 border-none text-gray-200 placeholder:text-gray-400 my-2"
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
                    className="bg-[#2e2e2e] hover:bg-zinc-900"
                  >
                    Kart Ekle
                  </Button>
                  <Button color="gray" onClick={handleCancelCreateCard}>
                    Kapat
                  </Button>
                </div>
              </form>
            ) : (
              <div
                onClick={handleCreateCard}
                className="new-card bg-zinc-600 hover:bg-zinc-500 text-gray-200 flex justify-between items-center py-3"
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

export default GrupStoreList;
