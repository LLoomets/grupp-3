import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
