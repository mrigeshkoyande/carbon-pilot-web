import { useState, useEffect, useCallback } from "react";
import { collection, query, where, orderBy, onSnapshot, limit, startAfter, getDocs } from "firebase/firestore";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import type { CarbonLog } from "../utils/emissionsMath";
import { z } from "zod";

// Zod Schema for strict runtime validation of Firestore payloads
const CarbonLogSchema = z.object({
  userId: z.string(),
  activityType: z.string(),
  value: z.number(),
  impact: z.number(),
  createdAt: z.any()
});

export const useEmissions = (userId: string | undefined) => {
  const [logs, setLogs] = useState<CarbonLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 20;

  useEffect(() => {
    if (!userId) {
      setLogs([]);
      setLastDoc(null);
      setHasMore(true);
      return;
    }

    setLoading(true);
    setError(null);
    const emissionsRef = collection(db, "emissions");
    const q = query(
      emissionsRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedLogs: CarbonLog[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          // Zod Runtime Validation
          const result = CarbonLogSchema.safeParse(data);
          if (result.success) {
            loadedLogs.push({ id: doc.id, ...result.data } as CarbonLog);
          } else {
            console.error("Zod Validation Failed on Document:", doc.id, result.error);
          }
        });
        
        setLogs(loadedLogs);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length === PAGE_SIZE);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore loading error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const loadMore = useCallback(async () => {
    if (!userId || !lastDoc || !hasMore || loading) return;

    try {
      setLoading(true);
      const emissionsRef = collection(db, "emissions");
      const nextQ = query(
        emissionsRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );

      const nextSnapshot = await getDocs(nextQ);
      const nextLogs: CarbonLog[] = [];
      
      nextSnapshot.forEach((doc) => {
        const data = doc.data();
        const result = CarbonLogSchema.safeParse(data);
        if (result.success) {
          nextLogs.push({ id: doc.id, ...result.data } as CarbonLog);
        }
      });

      setLogs((prev) => [...prev, ...nextLogs]);
      setLastDoc(nextSnapshot.docs[nextSnapshot.docs.length - 1] || null);
      setHasMore(nextSnapshot.docs.length === PAGE_SIZE);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, lastDoc, hasMore, loading]);

  return { logs, loading, error, loadMore, hasMore };
};
