const { Router } = require("express");
const adminRouter = Router();
const { AdminCollection, CourseCollection } = require("../db");
const bcrypt = require("bcrypt");
const { adminAuth } = require("../middleware/adminMiddleware");
const zod = require("zod");
const { default: mongoose } = require("mongoose");

//following route can be accessed using http://localhost:port/admin/signup
adminRouter.post("/signup", async function (req, res) {
  //validate request body using zod
  const requiredSignUpBody = zod.object({
    email: zod.string().email(),
    password: zod.string().min(3).max(10),
    firstName: zod.string(), //no validation for lastname
  });
  let safeparsedBody = requiredSignUpBody.safeParse(req.body);

  if (!safeparsedBody.success) {
    console.log(`Request body is not in proper format`);
    res.status(200).json({
      message: `Data format is invalid`,
      error: safeparsedBody.error,
    });
  }

  //now read the request
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  //check if user already exists
  const alreadyExistingUser = await AdminCollection.find({
    email: email,
  });

  if (alreadyExistingUser) {
    console.log(`User already exists with email [${email}]`);
    res.status(403).json({
      message: `User already exists with email [${email}]`,
    });
  }

  //create a hashed password
  const hashedPassword = await bcrypt.hash(password, 5);

  //add entry into the DB
  const userCreated = await AdminCollection.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
  });

  if (!userCreated) {
    console.log(`Failed to create user [${email}] in db`);
    res.status(500).json({
      message: `Unable to sign up for admin user`,
    });
  }

  //if everything works
  console.log(`Admin User signed up successfully`);

  res.status(200).json({
    message: "Admin user signed up successfully",
  });
});

//following route can be accessed using http://localhost:port/admin/signin
adminRouter.post("/signin", async function (req, res) {
  //Validate request body using zod
  const requiredSignInBody = zod.object({
    email: zod.string().email(),
    password: zod.string().min(3).max(10),
  });
  let safeparsedBody = requiredSignInBody.safeParse(req.body);

  if (!safeparsedBody.success) {
    console.log(`Request body is not in proper format`);
    res.status(400).json({
      message: "Request body is invalid",
      error: safeparsedBody.error,
    });
  }

  const email = req.body.email;
  const password = req.body.password;

  //check if user exists with the email
  const user = await AdminCollection.findOne({
    email: email,
  });

  if (!user) {
    console.log(`User not found in db with email [${email}]`);

    res.status(403).json({
      message: `No user found with email [${email}]`,
    });
  }

  //check the password of the user
  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    console.log(`Password mismatch for user: [${email}]`);

    req.status(403).json({
      message: `Password mismatch for user [${email}]`,
    });
  }

  //Generate token for user
  const token = jwt.sign(
    {
      id: user._id.toString(),
    },
    process.env.JWT_SECRET_ADMIN,
  );

  res.status(200).json({
    token: token,
  });
});

//this route could be in courseRoueter as well but this is the right place as this route can be protected by admin middleware
//(only admin should be able to acces this endpoint)
adminRouter.post("/course", adminAuth, async function (req, res) {
  //validate request body using zod
  const requiredCourseCreationBody = zod.object({
    title: zod.string().max(15),
    description: zod.string().min(5),
    price: zod
      .number({
        required_error: "Price is required",
        invald_type_error: "Price must be a float number",
      })
      .float(),
    //checks if creator id is a mongoose objectid
    creatorId: zod.string().refine((val) => {
      return mongoose.Types.ObjectId.isValid(val);
    }),
  });

  let safeparsedBody = requiredCourseCreationBody.safeParse(req.body);
  if (!safeparsedBody.success) {
    console.log(`Data provided is invalid`);
    res.status(400).json({
      message: `Data provided is invlid`,
      error: requiredCourseCreationBody.error,
    });
  }

  //create course
  const adminId = req.userId;
  const courseCreated = await CourseCollection.create({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageURL: req.body.imageURL,
    creatorId: adminId,
  });

  if (!courseCreated) {
    console.log(`Error during course creation`);

    res.status(500).json({
      message: "something went wrong during course creation",
    });
    return;
  }

  console.log(`Course creation successful!`);
  res.status(200).json({
    message: "Course created sucessfully",
    courseId: courseCreated._id,
  });
});

//update a course
adminRouter.put("/course", adminAuth, async function (req, res) {
  //validate the request body using zod
  const requiredCourseUpdateBody = zod.object({
    title: zod.string().max(15),
    description: zod.string().min(5),
    price: zod
      .number({
        required_error: "Price is mandatory",
        invalid_type_error: "Price should be a float number",
      })
      .float(),
    creatorId: zod.string().refine((val) => {
      return mongoose.Types.ObjectId.isValid(val);
    }),
  });

  let safeparsedBody = requiredCourseupdateBody.safeParse(req.body);
  if (!safeparsedBody.success) {
    console.log(`Request body is invalid`);
    res.status(400).json({
      message: `Iinvalid request body sent`,
    });
  }

  //update course
  const courseCreatorId = req.userId;
  const courseId = req.body.courseId;
  const updateCondition = {
    creatorId: courseCreatorId,
    courseId: courseId,
  };
  const toBeUpdated = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageURL: req.body.imageURL,
  };

  const courseUpdated = await CourseCollection.updateOne({
    updateCondition,
    toBeUpdated,
  });

  if (!courseUpdated) {
    console.log(`Course update failed for courseid [${courseId}]`);
    res.status(500).json({
      message: `Error during course update for courseId [${courseId}]`,
    });
  }

  //if successfully updated
  console.log(`Course [${courseId}] successfully updated.`);

  res.status(200).json({
    message: `Course [${courseId}] successfully updated. Course details: [${courseUpdated}]`,
  });
});

//get all courses(active and inactive)
adminRouter.get("/course/bulk", adminAuth, async function (req, res) {
  //validate the request body using zod
  const requiredCourseListBody = zod.object({
    title: zod.string().max(15),
    description: zod.string().min(5),
    price: zod
      .number({
        required_eror: "Price is requried",
        invalid_type_error: "Price should be a float number",
      })
      .float(),
    creatorId: zod.string().refine((val) => {
      return mongoose.Types.ObjectId.isValid(val);
    }),
  });
  const safeparsedBody = requiredCourseListBody.safeParse(req.body);
  if (!safeparsedBody.success) {
    console.log("request format is invalid");
    res.status(400).json({
      message: "Request body is invalid",
      error: requiredCourseListBody.error,
    });
  }

  //get all courses for the admin
  const adminId = req.userId;
  const allCourses = CourseCollection.find({
    creatorId: adminId,
  });

  if (!allCourses) {
    console.log(`No courses exist for this user [${adminId}]`);
    res.status(200).json({
      message: `There are no courses for this user [${adminId}]`,
    });
  }

  console.log(`Found all courses for user [${adminId}]`);
  res.status(200).json({
    message: `All courses for user [${adminId}]`,
    courses: allCourses,
  });
});

module.exports = { adminRouter };
