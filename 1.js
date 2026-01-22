const { error } = require('console');
const express = require('express');

const fsPromises = require('fs').promises
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

// small 1x1 PNG images encoded in base64 (served directly from memory)
const csePngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
const ecePngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';

var myLog1 = function(req, res, next){
    console.log('Section 1');
    next();
}
// app.get('/', function(req,rres){
//     res.send("welcome to WBD");
// })

// var rerr = function(err, req, res, next){
//     console.error(err.stack);
//     res.status(500).send("Somthing broken!");
    
// }
// // app.use(rres)

// var myLog2 = function(req, res, next){
//     if(req.query.age < 18){
//         res.send("You are not allowed at this page");
//     }
//     console.log('Section 2');
//     next();
// }

// app.use(myLog1)
// app.use(myLog2)

app.get('/fsd1', (req, res, next) => {
    fsPromises.readFile("./inedx.html")
    .then(data => res.send(data))
    .catch(err => next =>(err))
    res.send('this is fsd1 route');
});

app.get('/fsd2', (req, res, next) => {
    fsPromises.readFile("./inedx.html")
    .then(data => res.send(data))
    .catch(err => {
        err.type = 'redirect'
        next(err)
    })
    res.send('this is fsd1 route');
});

app.get('/error', (req, res) => {
    res.send('custom');
});
// Home page with buttons to go to CSE and ECE pages
app.get('/', (req, res) => {
    const html = `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>IIITS Home</title>
        <style>body{font-family:Arial,Helvetica,sans-serif;margin:40px}button{margin:8px;padding:10px 16px}</style>
      </head>
      <body>
        <h1>Welcome to IIITS</h1>
        <p>Choose a department:</p>
        <button onclick="location.href='/iiits/cse'">CSE</button>
        <button onclick="location.href='/iiits/ece'">ECE</button>
      </body>
    </html>`;
    res.send(html);
});

// Serve the CSE HTML file
app.get('/iiits/cse', (req, res) => {
    fsPromises.readFile(__dirname + '/cse.html', 'utf8')
    .then(data => res.type('html').send(data))
    .catch(err => res.status(500).send('Error loading CSE page'));
});

// Serve the CSE PNG
app.get('/iiits/cse/image', (req, res) => {
    const img = Buffer.from(csePngBase64, 'base64');
    res.type('png').send(img);
});

// Serve the ECE HTML file
app.get('/iiits/ece', (req, res) => {
    fsPromises.readFile(__dirname + '/ece.html', 'utf8')
    .then(data => res.type('html').send(data))
    .catch(err => res.status(500).send('Error loading ECE page'));
});

// Serve the ECE PNG
app.get('/iiits/ece/image', (req, res) => {
    const img = Buffer.from(ecePngBase64, 'base64');
    res.type('png').send(img);
});

app.use((err, req, res, next) => {
    console.log('Error handling middlaware called');
    console.log('Path:', req.path);
    console.log('Error:', error);
    if(error.type == 'rediredt')
        res.readFile('/error')
    else if(error.type == 'time-out')
        res.status(400).send(error)
    else
        res.status(500).send(error)
        next()
});
// app.get('/fsd3', (req, res) => {
//     res.send('this is fsd3 route');
// });



// app.get("/", (req, res) => {
//     res.send('Hellow World');
// })

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
