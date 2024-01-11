import { useEffect, useState } from "react";
import Layouts from "../../components/layout/Layouts";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IGroup } from "../../components/kanban/commonTypes";
import StoreList from "../../components/kanban/StoreList";
import CreateListModal from "../../components/create card/CreatListModale";
import { useSelector } from "react-redux";
import {
  getDocs,
  collection,
  db,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from "../../firebase/Firebase";
import { useDispatch } from "react-redux";
import { getAllList } from "../../reducer/getDataSlice";
import { query } from "firebase/firestore";
import { set } from "react-hook-form";

type IDATA = IGroup[];

const HomePage = () => {
  const [openModal, setOpenModal] = useState(false);

  const [deneme, setDeneme] = useState([]);
  const auth = useSelector((state) => state.getData.auth);
  /**********************************************************/ /**** */

  /**********************************************************/ /**** */
  useEffect(() => {
    const userCardCollection = collection(
      db,
      "users",
      auth,
      "lists"
      // Güncel authentication değerini kullan
    );
    const q = query(userCardCollection);
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const cities = [];
        querySnapshot.forEach((doc) => {
          cities.push({ id: doc.id, ...doc.data() });
        });
        console.log("Current cities in CA: ", cities);
        const sortedDeneme = cities.sort((a, b) => a.position - b.position);
        setDeneme(sortedDeneme);
      },
      (error) => {
        console.log(error);
      }
    );

    // useEffect temizlenme (cleanup) aşamasında unsubscribe fonksiyonunu çağır
    return () => {
      unsubscribe();
    };

    // useEffect bağımlılıkları arasına `deneme` eklemeyi unutmayın
    // eğer `deneme` değeri bu efekte bağlıysa
  }, []);

  // useEffect(() => {
  //   handleDataUpdate();
  //   const sortedDeneme = deneme.sort((a, b) => a.position - b.position);
  //   console.log("SIRALANMIŞ OLAN DİZİ", sortedDeneme);
  // }, []);

  // /**********************************************************/ /**** */
  // console.log("DENEMEEE", deneme);
  // const updatedDeneme = deneme.map((item, index) => ({
  //   position: index + 1,
  //   id: item.id,
  //   name: item.name,
  // }));
  // console.log("updatedDeneme", updatedDeneme);
  // const handleDataUpdate = async () => {
  //   const userAddCardCollection = collection(db, "users", auth, "lists");

  //   try {
  //     await Promise.all(
  //       updatedDeneme.map(async (item) => {
  //         const dataSec = doc(userAddCardCollection, item.id);
  //         await updateDoc(dataSec, {
  //           position: item.position,
  //         });
  //       })
  //     );

  //     console.log("Güncelleme işlemi başarılı!");
  //   } catch (error) {
  //     console.error("Güncelleme hatası:", error);
  //   }
  // };

  /**********************************************************/ /**** */
  const handleDragDrop = async (results: any) => {
    const { source, destination, type } = results;

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
      // removedStore &&
      const destinationIndex = destination.index;
      reorderedStores.splice(destinationIndex, 0, removedStore);
      console.log("reorderedStores", reorderedStores);
      const updatedDeneme = reorderedStores.map((item, index) => ({
        position: index + 1,
        id: item.id,
        name: item.name,
      }));
      const handleDataUpdate = async () => {
        const userAddCardCollection = collection(db, "users", auth, "lists");

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

      return handleDataUpdate();
    }
    const storeSourceIndex = deneme.findIndex(
      (store) => store.id === source.droppableId
    );
    const storeDestinationIndex = deneme.findIndex(
      (store) => store.id === destination.droppableId
    );

    const newSourceItems = [...deneme[storeSourceIndex].items];
    const newDestinationItems =
      source.droppableId !== destination.droppableId
        ? [...deneme[storeDestinationIndex].items]
        : newSourceItems;
    const [deletedItem] = newSourceItems.splice(source.index, 1);
    newDestinationItems.splice(destination.index, 0, deletedItem);

    const newStores = [...deneme];
    newStores[storeSourceIndex] = {
      ...deneme[storeSourceIndex],
      items: newSourceItems,
    };
    newStores[storeDestinationIndex] = {
      ...deneme[storeDestinationIndex],
      items: newDestinationItems,
    };
    setDeneme(newStores);
    newStores.map((list) => console.log("NEW STORES", list.items));
  };
  /**********************************************************/ /**** */
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
                {deneme.map((item, index) => (
                  <Draggable draggableId={item.id} key={item.id} index={index}>
                    {(provided: any) => (
                      <div
                        onClick={() => {}}
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
