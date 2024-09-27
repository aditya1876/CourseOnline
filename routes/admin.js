const { Router } = require("express");
const adminRouter = Router();
const { AdminCollection } = require("../db");
const bcrypt = require("bcrypt");

//following route can be accessed using http://localhost:port/admin/signup
adminRouter.post("/signup", async function (req, res) {
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
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
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
