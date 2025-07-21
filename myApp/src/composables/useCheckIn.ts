import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from "firebase/firestore";

export const saveCheckInToFirestore = async (checkIn: any) => {
  try {
    await addDoc(collection(db, "checkins"), {
      ...checkIn,
      visitDate: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Check-in Firebase’i salvestamine ebaõnnestus:", error);
    return false;
  }
};

export async function fetchLatestCheckIns(limitCount = 10) {
  const q = query(
    collection(db, "checkins"),
    orderBy("visitDate", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}