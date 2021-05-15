const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  res.send("result is " + (Number(req.body.num1) + Number(req.body.num2)));
});

app.get("/bmi", (req, res) => {
  res.sendFile(__dirname + "/bmiCalculator.html");
});

app.post("/bmiCalculator", (req, res) => {
  res.send(
    "your bmi is " + Number(req.body.weight) / (Number(req.body.height) ^ 2)
  );
});

app.listen(3300, function () {
  console.log("Server started");
});
