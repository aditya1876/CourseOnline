const express = require("express");
const mongoose = require("mongoose");

//routers
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

const app = express();
app.use(express.json());

//Define Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);

//Do mandatory steps that should complete before starting the app here
async function main() {
  //CONNECT TO DATABASE
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
  console.log(`Successfully connected to DB.`);

  //LISTEN
  app.listen(process.env.PORT, () => {
    console.log(`Server started on port: [${process.env.PORT}]`);
  });
}

main();
