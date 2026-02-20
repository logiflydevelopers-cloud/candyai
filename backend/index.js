const serverless = require("serverless-http");
const { app, connectDB } = require("../server");

module.exports = async (req, res) => {
  await connectDB();
  return serverless(app)(req, res);
};