const jwt = require("jsonwebtoken");

function userAuth(req, res, next) {
  const token = req.body.token;

  //decode the token and verify
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_USER);

  if (decodedToken) {
    req.userId = decodedToken.id;
    console.log(`User with userid [${decodedToken.id}] is authenticated`);
    next();
  } else {
    console.log(`Authentication failed or token: [${token}]`);
    res.status(403).json({
      message: "You are not signed in",
    });
  }
}

module.exports = {
  userAuth,
};
