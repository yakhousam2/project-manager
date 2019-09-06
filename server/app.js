require("./db");
const express = require("express");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const morgan = require('morgan')
const cors = require('cors')

const authRoute = require("./routes/auth");
const auth = require("./controllers/passport");
const userapi = require("./api/user");

const app = express();
auth();
app.use(morgan("tiny"))
app.use(cors())

const PORT = process.env.PORT || 3001;
const dev = process.env.NODE_ENV !== "production";

const restricAccess = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/auth");
  next();
};
const store = new MongoDBStore({
  uri: process.env.dbUri,
  collection: "session"
});

app.set("view engine", "pug");
app.set("views", "server/views");
app.use('/static', express.static(__dirname + '/public'));

app.use(
  session({
    secret: "kldskfmqkdlsmfqm",
    resave: true,
    saveUninitialized: true,
    store
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(flash());

app.use(authRoute);
app.use(userapi);



if (dev) {
  app.get("/", restricAccess, (req, res) => {
    res.render("index");
  });
} else {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("/", restricAccess, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
