const db = require("../config/db");

exports.index = async (req, res) => {
  const { tag } = req.query;

  try {
    let query = 'SELECT * FROM posts';
    let params = [];

    if (tag) {
      query += ' WHERE FIND_IN_SET(?, tags)';
      params.push(tag);
    }

    const [rows] = await db.execute(query, params);

    res.json({
      counter: rows.length,
      lista: rows,
    });
  } catch (err) {
    console.error('Errore durante il recupero dei post:', err);
    res.status(500).json({ message: 'Errore interno del server' });
  }
};

exports.getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute('SELECT * FROM posts WHERE id = ?', [id]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Post non trovato' });
    }
  } catch (err) {
    console.error('Errore durante il recupero del post:', err);
    res.status(500).json({ message: 'Errore interno del server' });
  }
};

exports.show = async (req, res) => {
  const { title } = req.params;

  try {
    const [rows] = await db.execute('SELECT * FROM posts WHERE LOWER(TRIM(title)) = LOWER(TRIM(?))', [title]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Post non trovato' });
    }
  } catch (err) {
    console.error('Errore durante il recupero del post:', err);
    res.status(500).json({ message: 'Errore interno del server' });
  }
};

exports.store = async (req, res) => {
  const { title, content, tags, published } = req.body;

  if (!title || !content || !tags) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO posts (title, content, tags, published) VALUES (?, ?, ?, ?)',
      [title, content, tags, published || false]
    );

    const newPost = {
      id: result.insertId,
      title,
      content,
      tags,
      published: published || false,
    };

    res.status(201).json(newPost);
  } catch (err) {
    console.error('Errore durante l\'inserimento del post:', err);
    res.status(500).json({ message: 'Errore interno del server' });
  }
};

exports.update = async (req, res) => {
  const { title } = req.params;
  const { content, tags, published } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM posts WHERE title = ?', [title]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Post non trovato' });
    }

    const query = 'UPDATE posts SET content = ?, tags = ?, published = ? WHERE title = ?';
    const params = [content || rows[0].content, tags || rows[0].tags, published ?? rows[0].published, title];

    await db.execute(query, params);

    res.status(200).json({
      id: rows[0].id,
      title,
      content: content || rows[0].content,
      tags: tags || rows[0].tags,
      published: published ?? rows[0].published,
    });
  } catch (err) {
    console.error('Errore durante l\'aggiornamento del post:', err);
    res.status(500).json({ message: 'Errore interno del server' });
  }
};

exports.destroy = async (req, res) => {
  const { title } = req.params;

  try {
    const [rows] = await db.execute('SELECT * FROM posts WHERE LOWER(TRIM(title)) = LOWER(TRIM(?))', [title]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Post non trovato' });
    }

    await db.execute('DELETE FROM posts WHERE LOWER(TRIM(title)) = LOWER(TRIM(?))', [title]);

    res.status(200).json({
      message: 'Post eliminato correttamente',
    });
  } catch (err) {
    console.error('Errore durante l\'eliminazione del post:', err);
    res.status(500).json({ message: 'Errore interno del server' });
  }
};
