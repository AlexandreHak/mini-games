const express = require('express');
const app = express();

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/routes/index.html');
});

app.get('/palindrome', (req, res) => {
  res.sendFile(__dirname + '/routes/palindrome.html');
});

app.get('/hangman', (req, res) => {
  res.sendFile(__dirname + '/routes/hangman.html');
});

app.get('/tic-tac-toe', (req, res) => {
  res.sendFile(__dirname + '/routes/tic-tac-toe.html');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));