const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Chemin vers ta base de données
const dbPath = path.join(__dirname, "database-test.db");
const db = new sqlite3.Database(dbPath);

// Fonction pour créer la table si elle n'existe pas
const createTable = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS table_test (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prenom TEXT NOT NULL,
      nom TEXT NOT NULL,
      email TEXT NOT NULL,
      adresse TEXT,
      profession TEXT
    )`);
  });
};

// Fonction pour ajouter un utilisateur
const addUser = (prenom, nom, email, adresse, profession) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO table_test (prenom, nom, email, adresse, profession) VALUES (?, ?, ?, ?, ?)`,
      [prenom, nom, email, adresse, profession],
      function (err) {
        if (err) {
          return reject(err);
        }
        resolve(this.lastID); // Retourne l'ID du nouvel enregistrement
      }
    );
  });
};

// Fonction pour récupérer tous les utilisateurs
const getUsers = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM table_test`, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows); // Retourne les lignes de la table
    });
  });
};


// Fonction pour modifier un utilisateur
const updateUser = (id, prenom, nom, email, adresse, profession) => {
  return new Promise((resolve, reject) => {
    db.run(`UPDATE table_test SET prenom = ?, nom = ?, email = ?, adresse = ?, profession = ? WHERE id = ?`, 
    [prenom, nom, email, adresse, profession, id], function(err) {
      if (err) {
        return reject(err);
      }
      resolve(this.changes); 
    });
  });
};

// Fonction pour supprimer un utilisateur
const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM table_test WHERE id = ?`, id, function(err) {
      if (err) {
        return reject(err);
      }
      resolve(this.changes); // Nombre de lignes supprimées
    });
  });
};


// Appeler la fonction pour créer la table au démarrage
createTable();

module.exports = { addUser, getUsers, updateUser, deleteUser };
