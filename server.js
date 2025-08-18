const express = require("express");
const app = express()
const PORT = 3333;

app.get("/", (req, res) => {
  res.send("hello express")
})

app.listen(PORT, () => console.log("サーバーが起動しました"))