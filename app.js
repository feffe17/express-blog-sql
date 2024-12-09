const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const host = "http://127.0.0.1";
const port = 3003;
const dbRouters = require('./routers/posts');
const db = require("./config/db")

app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());


db.getConnection()
  .then(() => console.log('Connesso al database MySQL!'))
  .catch(err => console.error('Errore durante la connessione al database:', err));

app.use("/posts", dbRouters);

app.use((req, res, next) => {
  res.status(404).json({ message: "Risorsa non trovata" });
});

app.use((err, req, res, next) => {
  console.error("Errore interno del server:", err.stack);
  res.status(500).json({ message: "Errore interno del server" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${host}:${port}`);
});
