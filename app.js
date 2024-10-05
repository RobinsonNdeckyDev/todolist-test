// Le fichier JavaScript qui contiendra notre CRUD.

// Sélectionner les éléments du DOM
const form = document.getElementById("userForm");
const userList = document.getElementById("userList");
const submitBtn = document.getElementById("submitBtn");
const userIndexField = document.getElementById("userIndex");

// Un tableau pour stocker les utilisateurs localement
// let users = [
//   {
//     prenom: "Moussa",
//     nom: "Touré",
//     email: "moussatoure@gmail.com",
//     adresse: "dakar",
//     profession: "developpeur",
//   },
//   {
//     prenom: "Thierno",
//     nom: "Samb",
//     email: "thiernosamb@gmail.com",
//     adresse: "dakar",
//     profession: "Informaticien",
//   },
//   {
//     prenom: "Jean",
//     nom: "Mendy",
//     email: "jeanmendy@gmail.com",
//     adresse: "Diamniadio",
//     profession: "ingenieur",
//   },
//   {
//     prenom: "Khady",
//     nom: "Ciss",
//     email: "khadyciss@gmail.com",
//     adresse: "Sebikotane",
//     profession: "mécanicienne",
//   },
//   {
//     prenom: "Léa",
//     nom: "Nzaly",
//     email: "leanzaly@gmail.com",
//     adresse: "Dakar",
//     profession: "enseignante",
//   },
// ];

// Gestion du formulaire pour ajouter ou modifier un utilisateur
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Empêche le rechargement de la page

  const prenom = document.getElementById("prenom").value;
  const nom = document.getElementById("nom").value;
  const email = document.getElementById("email").value;
  const adresse = document.getElementById("adresse").value;
  const profession = document.getElementById("profession").value;
  // Récupérer l'index de l'utilisateur à modifier
  const userIndex = userIndexField.value;

  if (userIndex == -1) {
    // Cas d'ajout d'un nouvel utilisateur
    try {
      const newUserId = await window.api.addUser(
        prenom,
        nom,
        email,
        adresse,
        profession
      );
      console.log(`Utilisateur ajouté avec succès, ID: ${newUserId}`);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur :", error);
    }
  } else {
    // Cas de modification d'un utilisateur existant
    try {
      await window.api.updateUser(
        userIndex,
        prenom,
        nom,
        email,
        adresse,
        profession
      );
      console.log("Utilisateur modifié avec succès");
      userIndexField.value = -1; // Réinitialiser l'index
      submitBtn.textContent = "Ajouter"; // Revenir à "Ajouter"
    } catch (error) {
      console.error("Erreur lors de la modification de l'utilisateur :", error);
    }
  }

  // Mettre à jour l'affichage avec le nouvel utilisateur ou la modification
  displayUsers();

  // Réinitialiser le formulaire après l'ajout ou la modification
  form.reset();
});

// Fonction pour afficher la liste des utilisateurs
async function displayUsers() {

  const users = await window.api.getUsers();

  console.log("Liste des users: ", users)
  // Réinitialiser l'affichage
  userList.innerHTML = "";

    
  // Parcourir le tableau des utilisateurs et créer des éléments de liste
  users.forEach((user, index) => {
    const li = document.createElement("li");
    const hr = document.createElement("hr");
    li.innerHTML = `
      <strong>${user.prenom} ${user.nom}</strong> <br>
      Email: ${user.email} <br>
      Adresse: ${user.adresse} <br>
      Profession: ${user.profession} <br>
    `;

    // Bouton pour modifier l'utilisateur
    const editBtn = document.createElement("button");
    editBtn.classList.add("btnMdf");
    editBtn.textContent = "Modifier";
    editBtn.onclick = () => {
      // Remplir les champs du formulaire avec les données de l'utilisateur sélectionné
      document.getElementById("prenom").value = user.prenom;
      document.getElementById("nom").value = user.nom;
      document.getElementById("email").value = user.email;
      document.getElementById("adresse").value = user.adresse;
      document.getElementById("profession").value = user.profession;

      // Stocker l'index de l'utilisateur dans un champ caché pour le modifier
      userIndexField.value = index;

      // Afficher un message
      console.log("id_user: ", userIndexField);

      // Changer le texte du bouton en "Mettre à jour"
      submitBtn.textContent = "Mettre à jour";
    };

    // Ajouter un bouton pour supprimer l'utilisateur
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Supprimer";
    deleteBtn.classList.add("btnDelete");
    deleteBtn.onclick = async () => {
      // Supprimer l'utilisateur du tableau
      // users.splice(index, 1);
      await window.api.deleteUser(user.id);
        
        // Afficher un message
        console.log("User supprimé avec succés")
      // Mettre à jour l'affichage après suppression
      displayUsers();
    };

    li.appendChild(editBtn);
    // Ajouter le bouton au li
    li.appendChild(deleteBtn);
    // Ajouter l'utilisateur à la liste affichée
    userList.appendChild(li);
    // Ajouter une ligne de séparation
    li.appendChild(hr);
  });
}

// Appeler la fonction pour afficher les utilisateurs existants au démarrage
displayUsers();
