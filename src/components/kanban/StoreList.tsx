import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "flowbite-react";
import { IGroup } from "./commonTypes";
import "./StoreList.css";
import { useState } from "react";
import { Textarea } from "flowbite-react";
function StoreList({ name, items, id }: IGroup) {
  const [createCard, setCreateCard] = useState(false);
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <div className="store-container ">
            <h3>{name}</h3>
          </div>
          <div className="items-container">
            {items.map((item, index) => (
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
              <>
                <div className="input-container">
                  <Textarea
                    onChange={(e) => {
                      console.log(e.target.value);
                    }}
                    className="create-card bg-[rgb(255, 176, 189)] border-none"
                    autoFocus
                    required
                    rows={4}
                    placeholder="Bu kart için başlık girin..."
                  ></Textarea>
                </div>
                <div className="flex justify-start gap-4">
                  <Button size="sm" gradientMonochrome="failure">
                    Kart Ekle
                  </Button>
                  <Button color="gray" onClick={() => setCreateCard(false)}>
                    İptal
                  </Button>
                </div>
              </>
            ) : (
              <div
                onClick={() => {
                  setCreateCard(true);
                }}
                className="new-card"
              >
                Kart ekle
              </div>
            )}
          </div>
        </div>
      )}
    </Droppable>
  );
}
export default StoreList;
