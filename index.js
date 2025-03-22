const functions = require("firebase-functions");
const app = require("./app"); // this is your Express app
exports.app = functions.https.onRequest(app);
