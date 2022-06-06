const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`)
});