const express = require('express')
const app = express()
  
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
  
app.get('/', (req, res) => res.send('Hello, Substrate!'))
  
app.listen(process.env.PORT, () => console.log(`⚡️[bootup]: Server is running at port: ${process.env.PORT}`))

