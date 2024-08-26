// Sélectionner l'élément du plateau de jeu
let gameBoard = document.getElementById('game-board');

// Définir les symboles
let symbols = ['🍎', '🍌', '🍊', '🍇', '🍓', '🍉', '🍋', '🥝'];
let gameCards = [...symbols, ...symbols]; // Duplique chaque symbole

// Mélanger les cartes
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
gameCards = shuffleArray(gameCards);

// Créer et ajouter les cartes au plateau de jeu
gameCards.forEach((symbol, index) => {
    // Créer un nouvel élément div
    let card = document.createElement('div');

    // Ajouter la classe 'card' à la div
    card.classList.add('card');

    // Ajouter un attribut data-id unique
    card.setAttribute('data-id', index);

    // Ajouter le symbole à la carte (initialement caché)
    card.innerHTML = `<span style="display: none;">${symbol}</span>`;

    // Ajouter la carte au plateau de jeu
    gameBoard.appendChild(card);
});

// Récupère toutes les cartes du plateau de jeu
const cards = document.querySelectorAll('.card');

// Parcourt toutes les cartes
// Variables pour gérer l'état du jeu
let firstCard = null; // Première carte sélectionnée
let secondCard = null; // Deuxième carte sélectionnée
let chrono; // ID du chronomètre
let seconds = 0; // Temps écoulé en secondes
let timer = document.getElementById('timer'); // Élément pour afficher le temps
let gameStarted = false; // Indique si le jeu a commencé
let moves = document.getElementById('moves'); // Élément pour afficher le nombre de coups
let click = 0; // Compteur de coups
let lockBoard = false; // Verrouillage du plateau pour empêcher les clics rapides

// Fonction pour démarrer le chronomètre
function startTimer() {
    if (!gameStarted) { // Vérifie si le jeu n'a pas encore commencé
        gameStarted = true; // Marque le jeu comme commencé
        // Démarre le chronomètre qui s'incrémente chaque seconde
        chrono = window.setInterval(function() {
            seconds++;
            timer.innerHTML = seconds; // Met à jour l'affichage du temps
        }, 1000);
    }
}

// Fonction pour vérifier si toutes les cartes sont vertes
function checkAllCardsGreen() {
    const allCards = document.querySelectorAll('.card'); // Sélectionne toutes les cartes
    const allGreen = Array.from(allCards).every(card => 
        card.style.backgroundColor === 'lightgreen' // Vérifie si toutes les cartes sont vertes
    );

    // Si toutes les cartes sont vertes
    if (allGreen) {
        console.log("Toutes les cartes sont vertes !");
        window.clearInterval(chrono); // Arrête le chronomètre
        // Affiche un message de félicitations avec le temps et le nombre de coups
        alert("Félicitations ! Vous avez terminé le jeu en " + seconds + " secondes et " + click + " coups !");
    }
}

// Fonction pour vérifier si les deux cartes sélectionnées correspondent
function checkForMatch() {
    if (firstCard && secondCard) { // Vérifie si deux cartes sont sélectionnées
        let firstSymbol = firstCard.querySelector('span'); // Récupère le symbole de la première carte
        let secondSymbol = secondCard.querySelector('span'); // Récupère le symbole de la deuxième carte

        // Vérifie si les symboles des deux cartes sont identiques
        if (firstSymbol && secondSymbol) {
            if (firstSymbol.textContent === secondSymbol.textContent &&
                firstCard.getAttribute('data-id') !== secondCard.getAttribute('data-id')) {
                // Si les symboles correspondent
                firstCard.style.backgroundColor = 'lightgreen'; // Change la couleur de fond de la première carte
                secondCard.style.backgroundColor = 'lightgreen'; // Change la couleur de fond de la deuxième carte
                
                // Désactive les clics sur les cartes trouvées
                firstCard.removeEventListener('click', cardClickHandler);
                secondCard.removeEventListener('click', cardClickHandler);
                
                checkAllCardsGreen(); // Vérifie si toutes les cartes sont vertes
            } else {
                // Si les symboles ne correspondent pas, cache-les après 1 seconde
                setTimeout(() => {
                    firstSymbol.style.display = 'none'; // Cache le symbole de la première carte
                    secondSymbol.style.display = 'none'; // Cache le symbole de la deuxième carte
                }, 1000);
            }
        }

        // Réinitialise les cartes après un court délai
        setTimeout(() => {
            firstCard = null; // Réinitialise la première carte
            secondCard = null; // Réinitialise la deuxième carte
            lockBoard = false; // Déverrouille le plateau
        }, 1000);
    }
}

// Fonction qui gère le clic sur les cartes
function cardClickHandler() {
    if (lockBoard) return; // Si le plateau est verrouillé, ne rien faire
    if (this === firstCard) return; // Empêche de cliquer deux fois sur la même carte

    startTimer(); // Démarre le chronomètre si ce n'est pas déjà fait
    click++; // Incrémente le compteur de coups
    moves.innerHTML = click; // Met à jour l'affichage du nombre de coups

    console.log('Carte cliquée !');
    let symbol = this.querySelector('span'); // Récupère le symbole de la carte cliquée

    if (!symbol) {
        console.error('Symbole non trouvé dans la carte'); // Affiche une erreur si le symbole n'est pas trouvé
        return;
    }

    symbol.style.display = 'block'; // Affiche le symbole de la carte

    if (!firstCard) {
        firstCard = this; // Si aucune carte n'est sélectionnée, sélectionne la première carte
    } else {
        secondCard = this; // Sélectionne la deuxième carte
        lockBoard = true; // Verrouille le plateau pour empêcher d'autres clics
        checkForMatch(); // Vérifie si les deux cartes correspondent
    }

    console.log(this); // Affiche la carte cliquée dans la console
}

// Boucle pour initialiser chaque carte
cards.forEach((card, index) => {
    card.setAttribute('data-id', index); // Attribue un ID unique à chaque carte
    card.addEventListener('click', cardClickHandler); // Ajoute un écouteur d'événements pour le clic
});

// Fonction pour réinitialiser le jeu
function resetGame() {
    // Réinitialise les variables
    firstCard = null;
    secondCard = null;
    seconds = 0;
    click = 0;
    gameStarted = false;
    lockBoard = false;

    // Réinitialise l'affichage du chronomètre et des coups
    timer.innerHTML = seconds;
    moves.innerHTML = click;

    // Réinitialise toutes les cartes
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.style.backgroundColor = ''; // Réinitialise la couleur de fond
        card.querySelector('span').style.display = 'none'; // Cache tous les symboles
        card.addEventListener('click', cardClickHandler); // Réajoute l'écouteur d'événements
    });

    console.log("Le jeu a été réinitialisé !");
}

// Boucle pour initialiser chaque carte
cards.forEach((card, index) => {
    card.setAttribute('data-id', index); // Attribue un ID unique à chaque carte
    card.addEventListener('click', cardClickHandler); // Ajoute un écouteur d'événements pour le clic
});

// Exemple d'appel à la fonction resetGame pour réinitialiser le jeu
// Vous pouvez l'appeler par exemple lors d'un clic sur un bouton "Réinitialiser"
document.getElementById('reset-button').addEventListener('click', resetGame);