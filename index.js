const express = require("express");

//routers
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

const app = express();

//Define Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);

//LISTEN
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port [${PORT}]`);
});
