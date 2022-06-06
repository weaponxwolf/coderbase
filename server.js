const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');

const fs = require('fs');

app.use(bodyParser.urlencoded({
    extended: true
}))

function createFile(filename) {
    fs.open(filename, 'r', function (err, fd) {
        if (err) {
            fs.writeFile(filename, '', function (err) {
                if (err) {
                    console.log(err);
                }
                console.log("The file was saved!");
            });
        } else {
            console.log("The file exists!");
        }
    });
}

const {
    exec,
    spawn
} = require("child_process");
const {
    log
} = require('console');

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/runcode', (req, res) => {
    try {
        dir = './cpp/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
                recursive: true
            });
        }
        fs.writeFile("./cpp/test.cpp", req.body.code, function (err) {
            if (err) {
                console.log(err);
            } else {
                // console.log("The file was saved!");
            }
        });
        exec("g++ -o ./cpp/a.out ./cpp/test.cpp", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                error.message = error.message.split('./cpp/').join('');
                var lines = error.message.split('\n');
                lines.splice(0, 1);
                var newtext = lines.join('\n');
                res.send(newtext);
            } else {
                const child = spawn("./cpp/a.out");
                child.stdin.write(req.body.stdin)
                child.stdin.end();
                child.stdout.on("data", (data) => {
                    res.send(data);
                });
                child.stdout.on('error', function (err) {
                    if (err.code == "EPIPE") {
                        child.exit(0);
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);
    }

});

app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`)
});