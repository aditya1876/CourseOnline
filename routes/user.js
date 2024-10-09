const { Router } = require("express");
const userRouter = Router();
const { UserCollection } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const zod = require("zod");

//following route can be accessed using http://localhost:port/user/signup
userRouter.post("/signup", async function (req, res) {
  //Verify request body using zod
  const requiredBody = zod.object({
    email: zod.string().email(),
    password: zod.string().min(3).max(10),
  });

  const safeparsedBody = requiredBody.safeParse(req.body);

  if (!safeparsedBody.success) {
    console.log(`Request body is not in proper format`);
    res.status(403).json({
      message: `Data format is invalid`,
      error: safeparsedBody.error,
    });
    return;
  }

  //read the request
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  const alreadyExistingUser = await UserCollection.findOne({
    email: email,
  });

  //check that the user does not already exist
  if (alreadyExistingUser) {
    console.log(`User already exists with the provided email [${email}]`);
    res.status(403).json({
      message: `User already exists with the provided email [${email}]`,
    });
  }

  //Hash user password
  const hashedPassword = await bcrypt.hash(password, 5);

  //create new entry in db
  const newUser = await UserCollection.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
  });

  console.log(`is user signed up? [${newUser}]`);

  if (!newUser) {
    console.log(
      `User Signup failed due to db call failure. newUser: [${newUser}]`,
    );

    res.status(500).json({
      message: "Error during signup",
    });
  }

  //if eveything works
  console.log(`User signup successful for email [${email}]`);
  res.status(200).json({
    message: `User singup successful for email [${email}]`,
  });
});

//following route can be accessed using http://localhost:port/user/signin
userRouter.post("/signin", async function (req, res) {
  //Verify request body using zod
  const requiredBody = zod.object({
    email: zod.string().email(),
    password: zod.string().min(3).max(10),
  });

  const safeparsedBody = requiredBody.safeParse(req.body);

  if (!safeparsedBody.success) {
    console.log(`Request body is not in proper format`);
    res.status(403).json({
      message: `Data format is invalid`,
      error: safeparsedBody.error,
    });
    return;
  }

  const email = req.body.email;
  const password = req.body.password;

  const user = await UserCollection.findOne({
    email: email,
  });

  if (!user) {
    console.log(`User with email [${email}] was not found in db`);

    res.status(403).json({
      message: "User not found in db",
    });
  }

  console.log(`User found in db: [${user}]`);

  //compare the user entered password and db password
  const comparePassword = await bcrypt.compare(password, user.password);
  console.log(`Password comparison result: [${comparePassword}]`);

  if (!comparePassword) {
    console.log(`User authentication failed! [${email}]`);
    res.status(403).json({
      message: "user authentication failed for user [${email}]",
    });
  }

  //create a token for the user
  const token = jwt.sign(
    {
      id: user._id.toString(),
    },
    process.env.JWT_SECRET_USER,
  );

  res.status(200).json({
    token: token,
  });
});

//following route can be accessed using http://localhost:port/user/purchases
userRouter.get("/purchases", function (req, res) {
  res.status(200).json({
    message: "/user/purchases route",
  });
});

module.exports = { userRouter };
