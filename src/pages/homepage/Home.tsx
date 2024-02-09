import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../firebase/Firebase";

const HomePage = () => {
  const [lastEntries, setLastEntries] = useState([]);
  const sortedLastEntries = lastEntries.sort((a, b) => {
    b.entryDateYear - a.entryDateYear;
    if (a.entryDateYear < b.entryDateYear) return -1;
    if (a.entryDateYear > b.entryDateYear) return 1;
    a.entryDateMonth - b.entryDateMonth;
    if (a.entryDateMonth < b.entryDateMonth) return -1;
    if (a.entryDateMonth > b.entryDateMonth) return 1;
    a.entryDateDay - b.entryDateDay;
    if (a.entryDateDay < b.entryDateDay) return -1;
    if (a.entryDateDay > b.entryDateDay) return 1;
    a.entryDateHour - b.entryDateHour;
    if (a.entryDateHour < b.entryDateHour) return 1;
    if (a.entryDateHour > b.entryDateHour) return 1;
    a.entryDateMinute - b.entryDateMinute;
    if (a.entryDateMinute < b.entryDateMinute) return -1;
    if (a.entryDateMinute > b.entryDateMinute) return 1;
    return a.entryDateSecond - b.entryDateSecond;
  });
  const reversedSortedLastEntries = sortedLastEntries.reverse();
  const getFirstThreeElement = reversedSortedLastEntries.splice(0, 3);
  console.log("AAA", getFirstThreeElement);

  const auth = useSelector((state) => state.auth.userDetails);
  useEffect(() => {
    const userCardCollection = collection(db, "group-boards");

    const q = query(userCardCollection);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const cities = [];
        querySnapshot.forEach((doc) => {
          const x = doc.data().member;
          const controlll = x && x.some((item) => item.includes(auth));

          if (doc.data().created === auth || controlll) {
            cities.push({ id: doc.id, ...doc.data() });
          }
        });

        setLastEntries(cities);
        console.log("BOARDLAR", cities);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [auth]);

  return (
    <div className="text-gray-200">
      {getFirstThreeElement &&
        getFirstThreeElement.map((item, i) => <div key={i}>{item.name}</div>)}
    </div>
  );
};

export default HomePage;
