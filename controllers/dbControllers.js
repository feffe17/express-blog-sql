const fs = require("fs");
const path = require("path");
const db = require("../db.json");
const { error } = require("console");

exports.index = (req, res) => {
  const { tag } = req.query;

  let filteredPosts = db;
  if (tag) {
    filteredPosts = db.filter(post => post.tags.includes(tag));
  }

  res.json({
    counter: filteredPosts.length,
    lista: filteredPosts,
  });
};

exports.getPostById = (req, res) => {
  // console.log("ID ricevuto:", req.params.id);
  const { id } = req.params;
  const post = db.find(post => post.id === parseInt(id)); // O usa il tuo database
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: "Post non trovato" });
  }
};

exports.show = (req, res) => {
  const post = db.find(
    (post) => post.title.trim().toLowerCase() === req.params.title.trim().toLowerCase()
  );

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: "Post non trovato" });
  }
};

exports.store = (req, res) => {
  const { title, content, tags, published } = req.body;

  if (!title || !content || !tags) {
    return res.status(400).json({ message: "Tutti i campi sono obbligatori" });
  }

  const newPost = {
    id: db.length + 1,
    title,
    content,
    tags,
    published: published || false,
  };

  db.push(newPost);

  fs.writeFile(
    path.join(__dirname, "../db.json"),
    JSON.stringify(db, null, 2),
    (err) => {
      if (err) {
        console.error("Errore durante il salvataggio del file:", err);
        return res.status(500).json({ message: "Errore interno del server" });
      }
      res.status(201).json(newPost);
    }
  );
};

exports.update = (req, res) => {
  const { title } = req.params;
  const { content, tags, published } = req.body;

  const postIndex = db.findIndex(post => post.title === title);
  if (postIndex === -1) {
    return res.status(404).json({ message: "Post non trovato" });
  }

  if (content) db[postIndex].content = content;
  if (tags) db[postIndex].tags = tags;
  if (typeof published === "boolean") db[postIndex].published = published;

  fs.writeFile(
    path.join(__dirname, "../db.json"),
    JSON.stringify(db, null, 2),
    (err) => {
      if (err) {
        console.error("Errore durante il salvataggio del file:", err);
        return res.status(500).json({ message: "Errore interno del server" });
      }
      res.status(200).json(db[postIndex]);
    }
  );
};

exports.destroy = (req, res) => {
  const { title } = req.params;
  console.log("Titolo ricevuto dalla richiesta:", title);
  console.log("Titoli nel database:", db.map(post => post.title));

  const postIndex = db.findIndex(
    (post) => post.title && post.title.trim().toLowerCase() === title.trim().toLowerCase()
  );

  if (postIndex === -1) {
    return res.status(404).json({ message: "Post non trovato" });
  }

  db.splice(postIndex, 1);

  fs.writeFile(
    path.join(__dirname, "../db.json"),
    JSON.stringify(db, null, 2),
    (err) => {
      if (err) {
        console.error("Errore durante il salvataggio del file:", err);
        return res.status(500).json({ message: "Errore interno del server" });
      }
      res.status(200).json({
        message: "Post eliminato correttamente",
        lista: db,
      });
    }
  );
};

