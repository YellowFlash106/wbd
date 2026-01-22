const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

var morgan = require('morgan');
const rfs = require('rotating-file-stream')

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const accessLogStream = rfs.createStream('access.log',{
    interval: '1d',
    path:__dirname + '/log'
})

app.use(morgan('dev', {stream: accessLogStream}));
var myLog1 = function(req, res, next){
    console.log('Section 1');
    next();
}
app.get('/', function(req, res){
    res.send(`
        <!doctype html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>WBD - Home</title>
            <style>
                body{ font-family: Arial, Helvetica, sans-serif; padding:20px }
                form{ max-width:420px }
                label{ display:block; margin-top:8px }
                input, select{ width:100%; padding:8px; margin-top:4px }
                button{ margin-top:12px; padding:8px 12px }
            </style>
        </head>
        <body>
            <h1>Club Registration</h1>
            <form method="POST" action="/submit">
                <label for="name">Name</label>
                <input id="name" name="name" type="text" required />

                <label for="rollno">Roll No</label>
                <input id="rollno" name="rollno" type="text" required />

                <label for="club">Select Club</label>
                <select id="club" name="club" required>
                    <option value="Chess">Chess</option>
                    <option value="Drama">Drama</option>
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                </select>

                <label for="memberType">Member Type</label>
                <select id="memberType" name="memberType" required>
                    <option value="Member">Member</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Treasurer">Treasurer</option>
                    <option value="Dean">Dean</option>
                </select>

                <button type="submit">Submit</button>
            </form>
        </body>
        </html>
    `);
})

var rerr = function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send("Somthing broken!");
    
}
// app.use(rres)

var myLog2 = function(req, res, next){
    if(req.query.age < 18){
        res.send("You are not allowed at this page");
    }
    console.log('Section 2');
    next();
}

app.use(myLog1)
// app.use(myLog2)

app.get('/fsd1',[rerr], (req, res) => {
    res.send('this is fsd1 route');
});
app.get('/fsd2', (req, res) => {
    res.send('this is fsd2 route');
});
    // Helper to escape user-provided values when rendering HTML
    function escapeHtml(unsafe){
        if(!unsafe && unsafe !== 0) return '';
        return String(unsafe)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Handle form submission and redirect to details page (POST -> Redirect -> GET)
    app.post('/submit', (req, res) => {
        const { name, rollno, club, memberType } = req.body;
        const qs = `?name=${encodeURIComponent(name||"")}&rollno=${encodeURIComponent(rollno||"")}&club=${encodeURIComponent(club||"")}&memberType=${encodeURIComponent(memberType||"")}`;
        res.redirect('/details' + qs);
    });

    app.get('/details', (req, res) => {
        const { name, rollno, club, memberType } = req.query;
        if(!name && !rollno && !club && !memberType){
            return res.send('<p>No submission found. Go back to <a href="/">home</a>.</p>');
        }
        res.send(`
            <!doctype html>
            <html>
            <head>
                <meta charset="utf-8" />
                <title>Submission Details</title>
                <style>
                    body{ font-family: Arial, Helvetica, sans-serif; padding:20px }
                    table{ border-collapse: collapse; width: 100%; max-width:720px }
                    th, td{ border:1px solid #ccc; padding:8px; text-align:left }
                    th{ background:#f4f4f4 }
                </style>
            </head>
            <body>
                <h1>Submitted Details</h1>
                <table>
                    <tr><th>Name</th><td>${escapeHtml(name)}</td></tr>
                    <tr><th>Roll No</th><td>${escapeHtml(rollno)}</td></tr>
                    <tr><th>Club</th><td>${escapeHtml(club)}</td></tr>
                    <tr><th>Member Type</th><td>${escapeHtml(memberType)}</td></tr>
                </table>
                <p><a href="/">Submit another</a></p>
            </body>
            </html>
        `);
    });
app.get('/fsd3', (req, res) => {
    res.send('this is fsd3 route');
});





app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;