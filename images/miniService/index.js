const express = require('express')
const app = express()
const fs = require('fs')
  
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
  
app.get('/', (req, res) => {
    const dName = req.query.name;
    fs.readdir(dName || "../app", (err, files) => {
        if (err) {
            return res.send(`No, at ${dName}`);
        }
        const names = files.reduce((a, b) => a + ' ' + b, '');
        res.send(`${dName}: ${names} ${process.cwd()}`);
    })
})

app.get('/write', (req, res) => {
    const fName = req.query.name;
    console.log("fName:", fName);
    
    fs.writeFile(`../app/${fName}${Math.random().toFixed(3)}`, "hello", "utf-8", (err) => {
        if (err) {
            return res.send('Write failed');
        }
    });
});

app.listen(process.env.PORT, () => console.log(`⚡️[bootup]: Server is running at port: ${process.env.PORT}`))

