const express  = require('express');
const app  = express();
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});


app.listen(3000, () => {
    console.log("server is up and running on port 3000")
})