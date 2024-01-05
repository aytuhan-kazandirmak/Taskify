import { useEffect, useState } from "react";
import Layouts from "../../components/layout/Layouts";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IGroup } from "../../components/kanban/commonTypes";
import StoreList from "../../components/kanban/StoreList";
import CreateListModal from "../../components/create card/CreatListModale";
type IDATA = IGroup[];
const DATA: IDATA = [
  {
    id: "0e2f0db1-5457-46b0-949e-8032d2f9997a",
    name: "Yapılacaklar",
    items: [
      { id: "26fd50b3-3841-496e-8b32-73636f6f4197", name: "3% Milk" },
      { id: "b0ee9d50-d0a6-46f8-96e3-7f3f0f9a2525", name: "Butter" },
    ],
    tint: 1,
  },
  {
    id: "487f68b4-1746-438c-920e-d67b7df46247",
    name: "Onay Bekleyenler",
    items: [
      {
        id: "95ee6a5d-f927-4579-8c15-2b4eb86210ae",
        name: "Designing Data Intensive Applications",
      },
      { id: "5bee94eb-6bde-4411-b438-1c37fa6af364", name: "Atomic Habits" },
    ],
    tint: 2,
  },
  {
    id: "25daffdc-aae0-4d73-bd31-43f73101e7c0",
    name: "Tamamlanmışlar",
    items: [
      { id: "960cbbcf-89a0-4d79-aa8e-56abbc15eacc", name: "Workbench" },
      { id: "d3edf796-6449-4931-a777-ff66965a025b", name: "Hammer" },
    ],
    tint: 3,
  },
];

const HomePage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [stores, setStores] = useState(DATA);
  useEffect(() => {
    console.log(stores);
  }, [stores]);

  const handleDragDrop = (results: any) => {
    const { source, destination, type } = results;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "group") {
      const reorderedStores = [...stores];
      const sourceIndex = source.index;
      const [removedStore] = reorderedStores.splice(sourceIndex, 1);
      const destinationIndex = destination.index;
      reorderedStores.splice(destinationIndex, 0, removedStore);
      return setStores(reorderedStores);
    }
    console.log({ destination, source });
    const storeSourceIndex = stores.findIndex(
      (store) => store.id === source.droppableId
    );
    const storeDestinationIndex = stores.findIndex(
      (store) => store.id === destination.droppableId
    );

    const newSourceItems = [...stores[storeSourceIndex].items];
    const newDestinationItems =
      source.droppableId !== destination.droppableId
        ? [...stores[storeDestinationIndex].items]
        : newSourceItems;
    const [deletedItem] = newSourceItems.splice(source.index, 1);
    newDestinationItems.splice(destination.index, 0, deletedItem);

    const newStores = [...stores];
    newStores[storeSourceIndex] = {
      ...stores[storeSourceIndex],
      items: newSourceItems,
    };
    newStores[storeDestinationIndex] = {
      ...stores[storeDestinationIndex],
      items: newDestinationItems,
    };

    setStores(newStores);
  };
  return (
    <Layouts>
      <DragDropContext onDragEnd={handleDragDrop}>
        <div className="card">
          <Droppable droppableId="ROOT" type="group" direction="horizontal">
            {(provided: any) => (
              <div
                className="todos"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {stores.map((item, index) => (
                  <Draggable draggableId={item.id} key={item.id} index={index}>
                    {(provided: any) => (
                      <div
                        className="todo rounded-lg"
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <StoreList {...item} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <div
                  onClick={() => {
                    setOpenModal(true);
                    console.log(openModal);
                  }}
                  className="new-list"
                >
                  Yeni Liste Ekleyin
                </div>
                {openModal && (
                  <CreateListModal
                    setOpenModal={setOpenModal}
                    openModal={openModal}
                  />
                )}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </Layouts>
  );
};

export default HomePage;
