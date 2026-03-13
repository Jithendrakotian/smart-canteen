import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// ─── Menu ─────────────────────────────────────────────────────────────────────
export async function getMenuItems() {
  const snapshot = await getDocs(collection(db, "menu"));
  return snapshot.docs.map((d) => ({ itemId: d.id, ...d.data() }));
}

export async function addMenuItem(item) {
  const docRef = await addDoc(collection(db, "menu"), {
    ...item,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateMenuItem(itemId, data) {
  const ref = doc(db, "menu", itemId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteMenuItem(itemId) {
  await deleteDoc(doc(db, "menu", itemId));
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export async function createOrder(orderData) {
  const docRef = await addDoc(collection(db, "orders"), {
    ...orderData,
    orderTime: serverTimestamp(),
    orderStatus: "pending",
  });
  return docRef.id;
}

export async function getUserOrders(userId) {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
    orderBy("orderTime", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ orderId: d.id, ...d.data() }));
}

export async function getAllOrders() {
  const q = query(collection(db, "orders"), orderBy("orderTime", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ orderId: d.id, ...d.data() }));
}

export async function updateOrderStatus(orderId, status) {
  await updateDoc(doc(db, "orders", orderId), { orderStatus: status });
}

// ─── Payments ─────────────────────────────────────────────────────────────────
export async function createPayment(paymentData) {
  const docRef = await addDoc(collection(db, "payments"), {
    ...paymentData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getAllPayments() {
  const snapshot = await getDocs(collection(db, "payments"));
  return snapshot.docs.map((d) => ({ paymentId: d.id, ...d.data() }));
}

// ─── Feedback ─────────────────────────────────────────────────────────────────
export async function submitFeedback(feedbackData) {
  const docRef = await addDoc(collection(db, "feedback"), {
    ...feedbackData,
    date: serverTimestamp(),
  });
  return docRef.id;
}

export async function getAllFeedback() {
  const q = query(collection(db, "feedback"), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ feedbackId: d.id, ...d.data() }));
}

export async function getUserFeedback(userId) {
  const q = query(collection(db, "feedback"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ feedbackId: d.id, ...d.data() }));
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function getAllUsers() {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((d) => ({ userId: d.id, ...d.data() }));
}

export async function getUserById(userId) {
  const docSnap = await getDoc(doc(db, "users", userId));
  return docSnap.exists() ? { userId: docSnap.id, ...docSnap.data() } : null;
}
