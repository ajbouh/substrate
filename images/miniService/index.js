const express = require('express')
const app = express()
const fs = require('fs')
  
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
  
app.get('/', (req, res) => {
    fs.readdir(".", (err, files) => {
        if (err) {
            return res.send('No, Substrate! ');
        }
        res.send('Hello, Substrate! ' + files.reduce((a, b) => a + ' ' + b, ""));
    })
})

app.listen(process.env.PORT, () => console.log(`⚡️[bootup]: Server is running at port: ${process.env.PORT}`))

