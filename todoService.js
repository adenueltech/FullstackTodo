// todoService.js
const admin = require("firebase-admin");
const serviceAccount = {
  "type": "service_account",
  "project_id": "nueltodoapp",
  "GOOGLE_PRIVATE_KEY_ID": "process.env.GOOGLE_PRIVATE_KEY",
  "GOOGLE_PRIVATE_KEY_ID": "process.env.GOOGLE_PRIVATE_KEY",
  "client_email": "firebase-adminsdk-fbsvc@nueltodoapp.iam.gserviceaccount.com",
  "client_id": "105558738898520631971",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40nueltodoapp.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
// import dotenv from 'dotenv';
// dotenv.config();
// Initialize Firebase Admin
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

  return snapshot.docs[0].data(); // you can also return doc.id if you need it
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
