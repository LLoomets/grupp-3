// src/composables/useQuotes.ts
import { collection, writeBatch, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
//import { quotes } from "../data/quotes";


// see oli ainult olemas olevate quote'ide lisamiseks 
/* export async function addQuotesBatch() {
  const batch = writeBatch(db);
  const quotesRef = collection(db, "quotes");

  quotes.forEach((text, index) => {
    const newDocRef = doc(quotesRef);
    batch.set(newDocRef, {
      id: index + 1,
      text,
    });
  });

  await batch.commit();
  console.log("Kõik tsitaadid lisatud!");
} */

// andmebaasist kätte saamiseks
export async function fetchQuotesFromFirestore(): Promise<{ id: number; text: string }[]> {
    const quotesRef = collection(db, "quotes");
    const snapshot = await getDocs(quotesRef);
    const quotes: { id: number; text: string }[] = [];
  
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.text) {
        quotes.push({ id: data.id || 0, text: data.text });
      }
    });
  
    // Sorteeri id järgi järjestusse
    quotes.sort((a, b) => a.id - b.id);
    return quotes;
  }
