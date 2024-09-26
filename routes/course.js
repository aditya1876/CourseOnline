const { Router } = require("express");
const courseRouter = Router();

//following route can be accessed using http://localhost:port/course/all-courses
courseRouter.get("/all-courses", function (req, res) {
  res.status(200).json({
    message: "/courses/all-courses route",
  });
});

//following route can be accessed using http://localhost:port/course/purchase
courseRouter.get("/purchase", function (req, res) {
  //user pays for the course
  res.status(200).json({
    message: "/course/purchase route",
  });
});

//following route can be accessed using http://localhost:port/course/preview
courseRouter.get("/preview", function (req, res) {
  res.status(200).json({
    message: "/course/preview route",
  });
});

module.exports = { courseRouter };
