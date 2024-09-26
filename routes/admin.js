const { Router } = require("express");
const adminRouter = Router();

//following route can be accessed using http://localhost:port/admin/signup
adminRouter.post("/signup", function (req, res) {
  res.status(200).json({
    message: "/admin/singup route",
  });
});

//following route can be accessed using http://localhost:port/admin/signin
adminRouter.post("/signin", function (req, res) {
  res.status(200).json({
    message: "/admin/signin route",
  });
});

//this route could be in courseRoueter as well but this is the right place as this route can be protected by admin middleware
//(only admin should be able to acces this endpoint)
adminRouter.post("/course/create", function (req, res) {
  res.status(200).json({
    message: "admin/course/create endpoint",
  });
});

//update a course
adminRouter.put("/course/update", function (req, res) {
  res.status(200).json({
    message: "admin course update endpoint",
  });
});

//get all courses(active and inactive)
adminRouter.get("/course/bulk", function (req, res) {
  res.status(200).json({
    message: "amdin course bulk endpoint",
  });
});

module.exports = { adminRouter };
