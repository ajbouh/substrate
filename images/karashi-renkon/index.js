const express = require('express')
const app = express()
  
app.use(express.urlencoded({ extended: true }))
//app.use(express.json())
app.use(express.static("files"))
  
app.listen(process.env.PORT, () => {
  console.log(`⚡️[bootup]: Server is running at port: ${process.env.PORT}`)})
