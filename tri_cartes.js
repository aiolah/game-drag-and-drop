// tableau des cartes
const cartes = ["carreau_01","carreau_02","carreau_03","carreau_04","carreau_05","carreau_06","carreau_07","carreau_08","carreau_09","carreau_10","carreau_11","carreau_12","carreau_13","coeur_01","coeur_02","coeur_03","coeur_04","coeur_05","coeur_06","coeur_07","coeur_08","coeur_09","coeur_10","coeur_11","coeur_12","coeur_13","pique_01","pique_02","pique_03","pique_04","pique_05","pique_06","pique_07","pique_08","pique_09","pique_10","pique_11","pique_12","pique_13","treffle_01","treffle_02","treffle_03","treffle_04","treffle_05","treffle_06","treffle_07","treffle_08","treffle_09","treffle_10","treffle_11","treffle_12","treffle_13"];

// Nombre de cartes à tirer et temps imparti
alert("Bienvenue sur le jeu de drag and drop des cartes ! \n\n Le but du jeu est simple : glissez-déposez les cartes dans la zone correspondant à leur symbole avant que le temps ne soit écoulé. \n\n Pour mettre en place le jeu, vous allez devoir choisir le nombre de cartes à tirer ainsi qu'un minuteur. \n\n Let's go !");
let nombre = demanderNombre();
let time = demanderTemps();

function demanderNombre()
{
    let nombre = prompt("Combien de cartes voulez-vous tirer ? (max 52)");
    if(nombre > 0 && nombre <= 52)
    {
        n = nombre - 1;
        return nombre;
    }
    else
    {
        demanderNombre();
    }
}

function demanderTemps()
{
    let time = prompt("Paramétrez un minuteur pour jouer (max 120 secondes) :");
    if(time > 0 && time <= 120)
    {
        document.querySelector("#time").innerText = time;
        let interval = setInterval(function timeRun() {
            // Pour arrêter le timer quand la partie est finie
            if(document.getElementById("cartes").childElementCount == 0)
            {
                clearInterval(interval);
                removeListeners();
                displayButton();
            }
            // Quand le temps est écoulé
            else if(time == 0)
            {
                alert("Dommage, le temps est écoulé ! \n\n Clique sur le bouton Rejouer pour relancer une partie 😉");
                clearInterval(interval);
                removeListeners();
                displayButton();
            }
            // Mettre à jour le timer = écoulement des secondes
            else
            {
                time--;
                document.querySelector("#time").innerText = time;
            }
        }, 1000);
    }
    else
    {
        demanderTemps();
    }
}

// tirage au sort et ajout des cartes dans le DOM
let cartesTirees = [];
for(let i = 0; cartesTirees.length <= n; i++)
{
    let hasard = Math.round(Math.random()*51);
    let carte = document.createElement("img");

    // Gestion des cartes pour qu'elles soient toutes différentes
    let nomCarte = cartes[hasard];
    let reponse = cartesTirees.find((carte) => carte == nomCarte);

    // Si la carte n'est pas dans le tableau cartesTirees
    if(reponse == undefined)
    {
        cartesTirees.push(nomCarte);
        carte.setAttribute("src", `cartes/${nomCarte}.GIF`);
        carte.setAttribute("id", nomCarte);
        carte.setAttribute("draggable", true);
        carte.addEventListener("dragstart", drag);
        document.getElementById("cartes").appendChild(carte);
    }
    else
    {
        continue;
    }
}

// Fonction de callback de l'évènement dragstart
function drag(evt)
{
    // console.log("Coucou !");
    evt.dataTransfer.setData('text', evt.target.id);
}

// Ecouteurs d'évènements
document.querySelectorAll(".couleur").forEach((div) => {
    // Survol
    div.addEventListener("dragover", dragOver);
    // Entrée
    div.addEventListener("dragenter", pimper);
    // Sortie
    div.addEventListener("dragleave", depimper);
    // Drop
    div.addEventListener("drop", receiveTheDrop);
})

// Fonction de callback de l'évènement dragover
function dragOver(evt)
{
    evt.preventDefault();
    // console.log("Coucou2");
}

// Fonction de callback de l'évènement dragenter
function pimper(evt)
{
    if(evt.target.className == "couleur")
    {
        evt.target.style.border = "3px dashed #03A9F4";
    }
}

// Fonction de callback de l'évènement dragenter
function depimper(evt)
{
    if(evt.target.className == "couleur")
    {
        evt.target.style.border = "2px solid silver";
    }
}

// Fonction de callback de l'évènement drop
function receiveTheDrop(evt)
{
    // console.log("Coucou3");
    let id = evt.dataTransfer.getData("text");
    // On vérifie que le type de la carte va bien dans la bonne couleur en comparant leur nom et leur id
    if(id.substring(0, 5) == evt.target.id.substring(0, 5))
    {
        // console.log("Même couleur");
        document.getElementById(evt.target.id).appendChild(document.getElementById(id));
        depimper(evt);
    }
    else
    {
        depimper(evt);
        alert("Pas le même symbole !");
    }

    // Si la div cartes n'a plus d'enfants
    if(document.getElementById("cartes").childElementCount == 0)
    {
        depimper(evt);
        alert("Bravo, tu as réussi 😄 ! \n\n Clique sur le bouton Rejouer pour relancer une partie si le cœur t'en dis 😉");
    }
}

// On efface tous les events listeners pour enlever les fonctionnalités de drag and drop sur les cartes et les div
function removeListeners()
{
    document.querySelector("#cartes").childNodes.forEach((carte) => {
        carte.removeEventListener("dragstart", drag);
    })

    document.querySelectorAll(".couleur").forEach((div) => {
        // Survol
        div.removeEventListener("dragover", dragOver);
        // Entrée
        div.removeEventListener("dragenter", pimper);
        // Sortie
        div.removeEventListener("dragleave", depimper);
        // Drop
        div.removeEventListener("drop", receiveTheDrop);
    })    
}

// On affiche le bouton Rejouer
function displayButton()
{
    let bouton = document.querySelector("#button");
    bouton.style.display = "flex";
    bouton.style.justifyContent = "center";    
}