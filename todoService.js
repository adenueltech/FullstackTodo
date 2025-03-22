// todoService.js
const admin = require("firebase-admin");
const serviceAccount = {
  GOOGLE_TYPE: "service_account",
  GOOGLE_PROJECT_ID: "nueltodoapp",
  GOOGLE_PRIVATE_KEY_ID: "8e2f5f62132d5ca96d4a7508b67c080729ccd0b1",
  GOOGLE_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDgD+S9QIgzlEEH\nQyeBfst8mhyWSVEf9vQzfjtaORBFeUUWhZxyrLF4+KXGj65v1St8UrwW0gyxSAhv\nc5pRVLltIqdJ7fJyYJa1tCbs2v0E7MtvoKeD1mCggMRE/3CwEfHTC3j//7DHzD/W\nmrzDWaGB7hKv8eiIq/j8wiYcAPNuZDm/SD/EwHFnlRfZRd0d9y4LlioUYLrDokro\njCptZHzQxhwdEKmoW9LAZWkhnCuDEHGKVEgVc0YdW/al9SZZGT+aP9dmVHes27rg\nfVvzK41zEJcjqUp85vKARTiYrHo7kXHq/Oc+U50AGwtbfF/uQKd0uNgd2MzCIB1M\nP4djsVU1AgMBAAECggEAF569TZEZupxAnbAf4EgaUfSaGmK4vV6mgC4ouhplY3mF\nBbqIk1Mus1K9ARlg+XOWrbi4EMzMXzz5fKxKYpQEpyNd0M6XfiS+BoIrD1GHlkcT\nLB2awyxsi8b/ScnG2pzNqiKduxj8jRd0TF6MEyjl/IE5MZiWG6BLc3PRGickgmi2\nadS7RUFZyCuQsd1sRwIQXMQHbeQiqEWnXWvIAgXKC2W4NuGfiGim9XooHFPrGn6t\nZL/sY9T9zbqcWZhQz3QX886QxEAfrhF5Tuo5X/0cfmzh63B9oq8jFldu1erNriqN\nbszn+uwita2/b77oUJ3fsdn78l06jiXyNQ+SQw1tgQKBgQDv6KdL77CL/bhOVIDL\n9g0r+79Yh4m7mv1gFMq2nKDOhAIBcTgsHNcWFwMV2BsZGQiQPCVkF1oGXgL5q/5j\n1JFXslxgkXAaLMYzH0r1S/lcU5w7EbI6wKd6IaUNdxmOwE+P+acPN4BGl0cO978/\n3wYmH7Z3O/HZW5Mlo5Wbz15+gQKBgQDvFyT5R57oDYmkWKlO1esf3oYPdjv1hM4/\nGHMAYSxR9maclJmaWCnWh7dAO4F7aUUgQR52BiTS0VTai5KRbdkMo8XDJu9HxSEf\np3+X3OEUj9FHihI4OFoL9VWsVhpLccNF6W4fZmAcnuRg03H5/pDIw8SIY1rLlxLL\nghknr7fktQKBgQC1wlodWfcz2IHuNm9uF3hbPlv1wppDHGWiiZ4bRAdA7xpl5VVd\ndmwuPDkGL7g4B5NJU4gwkNCPymIOrpQJJl8HRgZe01FPQ2TWDntH5MuDe4T966ZQ\nhO1dxme6D+W5FVIyDj7XdIEm+i3H1UN8LIgIEja3lx7gQlT1Sz5p0W4SAQKBgEJl\nkwcHNMIMwGS7mokiLyGyklhI5W3Ra9Vp3MYGNmCspOJnAiEyyquhFOrpm5PCMEg8\nzVDJdAB30bC/gfyRHO29rXX8oga0X/aCdZSe6oLjTaMoXNbwD1Gy2A/7+WFqPmhz\n4vklXRuVpKafEc/zOhIHC9U0gkp3seiCQKocylzhAoGAFWrhTgpXhMrE8UD9gETa\nfBSuJez7Vd8qDQ+hQ4XeZfyA5B63mHzqdL6khWCpz0nE/AUDXkvLW4ruZFNceCSg\n4++MRrT+oadWr+fHjznQnsxmpyrxfjzSD0yn2eUUAHk2yuN/1xayvHWNCItEwLv5\n0VCJ6e/DCtxEQbq2StRcXmU=",
  GOOGLE_CLIENT_EMAIL: "firebase-adminsdk-fbsvc@nueltodoapp.iam.gserviceaccount.com",
  GOOGLE_CLIENT_ID: "105558738898520631971",
  GOOGLE_AUTH_URI: "https://accounts.google.com/o/oauth2/auth",
  GOOGLE_TOKEN_URI: "https://oauth2.googleapis.com/token",
  GOOGLE_AUTH_PROVIDER_CERT_URL: "https://www.googleapis.com/oauth2/v1/certs",
  GOOGLE_CLIENT_CERT_URL: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40nueltodoapp.iam.gserviceaccount.com",
  GOOGLE_UNIVERSE_DOMAIN: "googleapis.com"
};

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
