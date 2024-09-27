const jwt = require("jsonwebtoken");

function adminAuth(req, res, next) {
  const token = req.body.token;

  //decode the token for verification
  const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);

  if (decoded) {
    console.log(`Successful authentication for admin [${decoded.id}]`);
    req.userId = decoded.id;
    next();
  } else {
    console.log(`Authentication failed for admin token: [${token}]`);
    res.status(403).json({
      message: "You are not authenticated",
    });
  }
}

module.exports = {
  adminAuth,
};
