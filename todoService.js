const admin = require("firebase-admin");
require("dotenv").config(); // Load .env variables if you're testing locally

const serviceAccount = {
  type: "service_account",
  project_id: "nueltodoapp",
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // important!
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
  universe_domain: "googleapis.com"
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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
