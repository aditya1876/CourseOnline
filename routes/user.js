const { Router } = require("express");

const userRouter = Router();

//following route can be accessed using http://localhost:port/user/signup
userRouter.post("/signup", function (req, res) {
  res.status(200).json({
    message: "/user/signup route",
  });
});

//following route can be accessed using http://localhost:port/user/signin
userRouter.post("/signin", function (req, res) {
  res.status(200).json({
    message: "/user/signin route",
  });
});

//following route can be accessed using http://localhost:port/user/purchases
userRouter.get("/purchases", function (req, res) {
  res.status(200).json({
    message: "/user/purchases route",
  });
});

module.exports = { userRouter };
