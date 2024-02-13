import { collection, onSnapshot, query } from "firebase/firestore";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../firebase/Firebase";
import { RootState } from "../../reducer/store";
type Iboard = {
  created: string;
  entryDateDay: number;
  entryDateHour: number;
  entryDateMinute: number;
  entryDateMonth: number;
  entryDateSecond: number;
  entryDateYear: number;
  id: string;
  member: string[];
  name: string;
};

const HomePage: FC = () => {
  const [lastEntries, setLastEntries] = useState<Iboard[]>([]);
  const sortedLastEntries = lastEntries.sort((a: Iboard, b: Iboard) => {
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
  console.log("DENEM", getFirstThreeElement);

  const auth = useSelector((state: RootState) => state.auth.userDetails);
  useEffect(() => {
    const userCardCollection = collection(db, "group-boards");
    const q = query(userCardCollection);
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const cities: Iboard[] = [];
        querySnapshot.forEach((doc) => {
          cities.push({ ...doc.data() });
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
      <div className="py-5 text-gray-200 text-xl">Son açılanlar</div>
      <div className="flex gap-x-5">
        {getFirstThreeElement &&
          getFirstThreeElement.map((item, i) => <div key={i}>{item.name}</div>)}
      </div>
    </div>
  );
};

export default HomePage;
