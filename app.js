require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");


const app = express();
const port = process.env.PORT || 3000; 
const host = '100.20.92.101';

const cors = require("cors");

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors(corsOptions));

const userRoutes = require("./routes/userRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const expense = require("./models/expense");

const dbConnectionString = `${process.env.DATABASE_CONNECTION_STRING}/${process.env.DATABASE_NAME}`;

mongoose
  .connect(`${process.env.DATABASE_CONNECTION_STRING}personal_budget_app`,{
  }
    )
  .then(() => {
    app.listen(port, host, () => {
      console.log(`Server is running at port ${port}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(
  session({
    secret: process.env.MONGO_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: `${process.env.DATABASE_CONNECTION_STRING}personal_budget_app`,
    }),
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/budget", budgetRoutes);
app.use("/api/v1/expense", expenseRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
