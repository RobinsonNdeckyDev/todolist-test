// main.js
console.log("Main process works");

console.log("main.js");

// Modules pour la gestion de l'appli et la création de la BrowserWindow native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const { addUser, getUsers, updateUser, deleteUser } = require("./database.js");
const path = require("node:path");

// Obtenir les mises à jour en temps réel
require("electron-reload")(path.join(__dirname), {
  electron: path.join(__dirname, "node_modules", ".bin", "electron"),
});


const createWindow = () => {
  // Création de la browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      disableBlinkFeatures: "Autofill",
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // et chargement de l'index.html de l'application.
  mainWindow.loadFile("index.html");

  // Ouvrir les outils de développement.
  mainWindow.webContents.openDevTools();
};

// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quant cet événement est émit.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // Sur macOS il est commun de re-créer une fenêtre  lors
    // du click sur l'icone du dock et qu'il n'y a pas d'autre fenêtre ouverte.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quitter quand toutes les fenêtres sont fermées, sauf sur macOS. Dans ce cas il est courant
// que les applications et barre de menu restents actives jusqu'à ce que l'utilisateur quitte
// de manière explicite par Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Dans ce fichier vous pouvez inclure le reste du code spécifique au processus principal.
// Vous pouvez également le mettre dans des fichiers séparés et les inclure ici.



// Gérer l'ajout d'un utilisateur
ipcMain.handle('add-user', async (event, prenom, nom, email, adresse, profession) => {
  return await addUser(prenom, nom, email, adresse, profession);
});

// Gérer la récupération des utilisateurs
ipcMain.handle('get-users', async () => {
  return await getUsers();
});

// Gérer la mise à jour d'un utilisateur
ipcMain.handle('update-user', async (event, id, prenom, nom, email, adresse, profession) => {
  return await updateUser(id, prenom, nom, email, adresse, profession);
});

// Gérer la suppression d'un utilisateur
ipcMain.handle('delete-user', async (event, id) => {
  return await deleteUser(id);
});