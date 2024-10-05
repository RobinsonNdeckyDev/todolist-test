// preload.js

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // Récupérer la liste des utilisateurs
  getUsers: () => ipcRenderer.invoke("get-users"),
  // Ajouter un utilisateur
  addUser: (prenom, nom, email, adresse, profession) =>
    ipcRenderer.invoke("add-user", prenom, nom, email, adresse, profession),
  // mettre à jour un utilisateur
  updateUser: (id, prenom, nom, email, adresse, profession) =>
    ipcRenderer.invoke(
      "update-user",
      id,
      prenom,
      nom,
      email,
      adresse,
      profession
    ),
  // supprimer un utilisateur
  deleteUser: (id) => ipcRenderer.invoke("delete-user", id),
});
