const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nueltodoapp.firebaseio.com" // Replace with your actual Firebase Project ID
});

// Initialize Firestore
const db = admin.firestore();
const todosCollection = db.collection("todos");
const usersCollection = db.collection("users");

// 🔥 Get all todos for a specific user with IDs
async function getTodosWithIds(username) {
  const snapshot = await todosCollection.where('username', '==', username).get();
  const todos = [];
  snapshot.forEach((doc) => {
    todos.push({ id: doc.id, ...doc.data() });
  });
  return todos;
}

// ➕ Add a new todo for a specific user
async function addTodo(task, username) {
  await todosCollection.add({ task, username });
}

// ❌ Delete a todo by ID
async function removeTodo(id) {
  await todosCollection.doc(id).delete();
}

// ✏️ Edit a todo by ID
async function editTodo(id, newTask) {
  await todosCollection.doc(id).update({ task: newTask });
}

// 👤 Create new user (signup)
async function createUser(username, password) {
  const snapshot = await usersCollection.where('username', '==', username).get();
  if (!snapshot.empty) {
    throw new Error("Username already exists");
  }
  await usersCollection.add({ username, password });
}

// 🔐 Login user
async function loginUser(username, password) {
  const snapshot = await usersCollection
    .where('username', '==', username)
    .where('password', '==', password)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].data(); // you can also return doc.id if needed
}

// ✅ Export all functions
module.exports = {
  getTodosWithIds,
  addTodo,
  removeTodo,
  editTodo,
  createUser,
  loginUser,
};
