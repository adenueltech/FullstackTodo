const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const fs = require("fs");
const todo = require("./todoService"); // ← ✅ Add this line

const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "growth-todo-secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Auth middleware
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

// ROUTES
app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/todos");
  } else {
    res.redirect("/login");
  }
});

// LOGIN PAGE
app.get("/login", (req, res) => {
  const html = fs.readFileSync(
    path.join(__dirname, "Views", "login.html"),
    "utf8"
  );
  res.send(html);
});

// LOGIN SUBMIT
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await todo.loginUser(username, password);
    if (user) {
      req.session.user = username;
      res.redirect("/todos");
    } else {
      res.send(
        `<h3>❌ Invalid credentials. <a href="/login">Try again</a></h3>`
      );
    }
  } catch (err) {
    res.send(`<h3>🔥 Error: ${err.message}</h3>`);
  }
});

// SIGNUP PAGE
app.get("/signup", (req, res) => {
  const html = fs.readFileSync(
    path.join(__dirname, "Views", "signup.html"),
    "utf8"
  );
  res.send(html);
});

// SIGNUP SUBMIT
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    await todo.createUser(username, password);
    res.redirect("/login");
  } catch (err) {
    res.send(`<h3>⚠️ ${err.message} <a href="/signup">Try again</a></h3>`);
  }
});

// LOGOUT
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// TODO PAGE (secured)
app.get("/todos", isAuthenticated, async (req, res) => {
  try {
    const todos = await todo.getTodosWithIds(req.session.user); // 🔥 fetch only this user's todos

    let listHTML = todos
      .map(
        (t, i) => `
          <li>
  ${i + 1}. ${t.task}
  <form action="/delete" method="POST" style="display:inline; margin-top:10px;">
      <input type="hidden" name="docId" value="${t.id}">
      <button class="delete-btn" type="submit">🗑 Delete</button>
  </form>
  <form action="/edit" method="POST" style="display:inline; margin-left:10px;">
      <input type="hidden" name="docId" value="${t.id}">
      <input type="text" name="newTask" required />
      <button class="edit-btn" type="submit">✏ Edit</button>
  </form>
</li>

        `
      )
      .join("");

    let html = fs.readFileSync(
      path.join(__dirname, "Views", "index.html"),
      "utf8"
    );
    html = html.replace(
      '<ul id="todo-list">',
      `<ul id="todo-list">${listHTML}`
    );
    html = html.replace(
      "</body>",
      `<p style="text-align:center;"><a class="logout-btn" href="/logout"> Logout</a></p></body>`
    );

    res.send(html);
  } catch (error) {
    res.send(`<h2>🔥 Error loading todos: ${error.message}</h2>`);
  }
});

// ADD TODO (secured)
app.post("/add", isAuthenticated, async (req, res) => {
  const task = req.body.task;
  const username = req.session.user;
  await todo.addTodo(task, username); // ➕ link todo to user
  res.redirect("/todos");
});

// DELETE TODO (secured)
app.post("/delete", isAuthenticated, async (req, res) => {
  const docId = req.body.docId;
  await todo.removeTodo(docId);
  res.redirect("/todos");
});

// EDIT TODO (secured)
app.post("/edit", isAuthenticated, async (req, res) => {
  const docId = req.body.docId;
  const newTask = req.body.newTask;
  await todo.editTodo(docId, newTask);
  res.redirect("/todos");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server started at http://localhost:${PORT}`);
});
module.exports = app;
