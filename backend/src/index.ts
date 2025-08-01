import express from "express";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.get("/check", (req, res) => {
  return res.json({
    message: "Good Server is up & running!!",
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
