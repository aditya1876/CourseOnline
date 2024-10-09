const zod = require("zod");

function validateRequestBody(requestType) {
  let requiredRequestBody, safeParsedBody;
  if (requestType === "user") {
    requiredRequestBody = zod.object({
      firstName: zod.string(),
      email: zod.string().email(),
      password: zod.string().min(3).max(10),
      //no validation for lastName
    });

    safeParsedBody = requiredRequestBody.safeParse(req.body);
  }

  //validate the response
  safeParsedBody = requiredRequestBody.safeParse(req.body);

  if (!safeParsedBody.success) {
    console.log("Request body format is invalid");
    res.status(400).json({
      message: "Request body format is invalid",
      error: safeParsedBody.error,
    });
  }

  next();
}

module.exports = {
  validateRequestBody(requestType): validateRequestBody(requestType)
}
