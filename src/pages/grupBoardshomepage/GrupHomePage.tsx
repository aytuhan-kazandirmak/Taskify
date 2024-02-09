import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { HiOutlinePlus } from "react-icons/hi";
import { IGroup } from "../../components/kanban/commonTypes";
import { useSelector } from "react-redux";
import {
  collection,
  db,
  doc,
  updateDoc,
  onSnapshot,
} from "../../firebase/Firebase";
import { RootState } from "../../reducer/store";
import { deleteDoc, getDoc, query } from "firebase/firestore";
import { useParams } from "react-router-dom";
import CreateGroupListModal from "../../components/gruplistmodal/CreateGroupListModal";
import GrupStoreList from "../../components/grupstorelist/GrupStoreList";
type IDATA = IGroup[];

const GrupHomePage: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [deneme, setDeneme] = useState<IDATA>([]);
  const [boardName, setBoardName] = useState("");
  const params = useParams();
  console.log("ZIIIIIIIIIIIIII", params);
  const auth = useSelector((state: RootState) => state.getData.auth);

  useEffect(() => {
    const getBoardName = async () => {
      try {
        const boardNameColection = collection(db, "group-boards");
        const selectBoardName = doc(boardNameColection, params.groupId);
        const board = await getDoc(selectBoardName);
        console.log("boardsssssssss", board.data().name);
        setBoardName(board.data().name);
        return board;
      } catch (error) {
        console.log("ERROR", error);
      }
    };
    getBoardName();
  }, [params.groupId]);
  useEffect(() => {
    const userCardCollection = collection(
      db,
      "group-boards",
      `${params.groupId}`,
      "lists"
    );

    const q = query(userCardCollection);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const cities: IGroup[] = [];
        querySnapshot.forEach((doc) => {
          cities.push({ id: doc.id, ...doc.data() });
        });

        const sortedData = cities.sort(
          (a: any, b: any) => a.position - b.position
        );
        setDeneme(sortedData);
        console.log("veri geldi");
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [auth]);

  /********************************************************************** */
  /********************************************************************** */
  const removeCard = (listId, index, cardId) => {
    const listCollection = collection(
      db,
      "group-boards",
      `${params.groupId}`,
      "lists"
    );
    const listRef = doc(listCollection, listId);
    console.log("listID:", listId);
    deneme.forEach(async (list) => {
      console.log("list id:", listId, "index no:", index, "cardId:", cardId);
      if (list.id === listId) {
        await updateDoc(listRef, {
          items: list.items.filter((card) => card.id !== cardId),
        });
      }
      return list;
    });
  };
  const removeList = async (listId) => {
    const listCollection = collection(
      db,
      "group-boards",
      `${params.groupId}`,
      "lists"
    );
    const listRef = doc(listCollection, listId);
    await deleteDoc(listRef);
  };
  /********************************************************************** */
  /********************************************************************** */

  const handleDragDrop = async (results: DropResult) => {
    const userAddCardCollection = collection(
      db,
      "group-boards",
      `${params.groupId}`,
      "lists"
    );
    const { destination, source, draggableId, type } = results;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "group") {
      const reorderedStores = [...deneme];
      const sourceIndex = source.index;
      const [removedStore] = reorderedStores.splice(sourceIndex, 1);

      const destinationIndex = destination.index;
      reorderedStores.splice(destinationIndex, 0, removedStore);

      const updatedDeneme = reorderedStores.map((item, index) => ({
        position: index + 1,
        id: item.id,
        name: item.name,
      }));

      const handleListUpdate = async () => {
        try {
          await Promise.all(
            updatedDeneme.map(async (item) => {
              const dataSec = doc(userAddCardCollection, item.id);
              await updateDoc(dataSec, {
                position: item.position,
              });
            })
          );

          console.log("Güncelleme işlemi başarılı!");
        } catch (error) {
          console.error("Güncelleme hatası:", error);
        }
      };

      handleListUpdate();
    }
    /************************************************************************************** */
    /************************************************************************************** */
    if (source.droppableId === destination.droppableId) {
      const saveCardCollection = collection(
        db,
        "group-boards",
        `${params.groupId}`,
        "lists"
      );
      const list = deneme.find((list) => list.id === source.droppableId);

      const updatedCards = list?.items.map((card, index) => {
        if (index === source.index) {
          return list.items[destination.index];
        }
        if (index === destination.index) {
          return list.items[source.index];
        }
        return card;
      });
      const listRef = doc(saveCardCollection, destination.droppableId);
      console.log("listRef", listRef.id);
      await updateDoc(listRef, {
        items: updatedCards,
      });
    } else {
      const sourceList = deneme.find((list) => list.id === source.droppableId);
      const destinationList = deneme.find(
        (list) => list.id === destination.droppableId
      );
      const draggingCard = sourceList.items.filter(
        (card) => card.id === draggableId
      )[0];
      console.log(sourceList, destinationList);
      const sourceListRef = doc(
        collection(db, "group-boards", `${params.groupId}`, "lists"),
        source.droppableId
      );

      sourceList.items.splice(source.index, 1);
      await updateDoc(sourceListRef, {
        items: sourceList.items,
      });

      const destinationListRef = doc(
        collection(db, "group-boards", `${params.groupId}`, "lists"),
        destination.droppableId
      );
      destinationList.items.splice(destination.index, 0, draggingCard);

      await updateDoc(destinationListRef, {
        items: destinationList.items,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragDrop}>
      <div className="card">
        <div className="py-5 text-gray-200 text-xl">{boardName}</div>
        <Droppable droppableId="ROOT" type="group" direction="horizontal">
          {(provided) => (
            <div
              className="todos"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {deneme.map((item, index) => (
                <Draggable draggableId={item.id} key={item.id} index={index}>
                  {(provided) => (
                    <div
                      onClick={() => {}}
                      className="todo rounded-lg"
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <GrupStoreList
                        {...item}
                        index={index}
                        removeCard={removeCard}
                        removeList={removeList}
                        params={params.groupId}
                        boardName={boardName}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              <div
                onClick={() => {
                  setOpenModal(true);
                }}
                className="bg-zinc-800 w-[272px] rounded-lg flex items-center cursor-pointer justify-center gap-x-2 text-gray-200 h-[78px]"
              >
                <div> Yeni Liste</div>
                <HiOutlinePlus />
              </div>

              {openModal && (
                <CreateGroupListModal
                  setOpenModal={setOpenModal}
                  openModal={openModal}
                  params={params}
                />
              )}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default GrupHomePage;
