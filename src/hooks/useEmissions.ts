import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import type { CarbonLog } from "../utils/emissionsMath";

export const useEmissions = (userId: string | undefined) => {
  const [logs, setLogs] = useState<CarbonLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLogs([]);
      return;
    }

    setLoading(true);
    setError(null);
    const emissionsRef = collection(db, "emissions");
    const q = query(
      emissionsRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedLogs: CarbonLog[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        snapshot.forEach((doc: any) => {
          loadedLogs.push({
            id: doc.id,
            ...doc.data(),
          } as CarbonLog);
        });
        setLogs(loadedLogs);
        setLoading(false);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err: any) => {
        console.error("Firestore loading error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { logs, loading, error };
};
