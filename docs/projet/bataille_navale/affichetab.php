<?php
/*
 * Jeu de bataille navale pour deux joueurs, à lancer dans un terminal avec PHP.
 * Chaque joueur place ses cinq bateaux, puis les tirs se font à tour de rôle.
 * Les lignes et les colonnes sont numérotées de 0 à 9 dans les tableaux.
 * Une case vaut 0 pour l’eau, un nombre positif pour un bateau, un nombre
 * négatif pour une partie touchée et « X » pour un tir tombé dans l’eau.
 */

// Affiche les m lignes et les n colonnes du tableau dans le terminal.
// La boucle extérieure passe d’une ligne à l’autre ; celle à l’intérieur affiche ses cases.
function affichetab($tab, $m, $n){
	for($i=0; $i<$m; $i++){
		for($j=0; $j<$n; $j++){
			echo $tab[$i][$j]." ";
		}
		echo "\n";
	}
	echo "------------\n";
}

// Crée une grille de 10 lignes et 10 colonnes remplie de zéros.
// Chaque appel renvoie une nouvelle grille indépendante pour un joueur.
function initialisegrille(){
	$grille = array(); // Le tableau sera rempli case par case par les deux boucles.
	for($i=0; $i<10; $i++){
		for($j=0; $j<10; $j++){
			$grille[$i][$j] = 0;
		}
	}
	return $grille;
}

// Demande les coordonnées du tir et met à jour la grille adverse.
// Le & devant les paramètres permet de modifier directement la grille et les vies du joueur concerné.
function tire(&$grille, &$vie){
    $l = (int) readline("Sur quelle ligne voulez-vous tirer ? :");
    $c = (int) readline("Sur quelle colonne voulez-vous tirer ?: ");
    
    // Une valeur négative ou un X signifie qu’un tir a déjà eu lieu sur cette case.
    // On quitte alors cette fonction sans retirer de vie supplémentaire.
    if ($grille[$l][$c] == "X" or $grille[$l][$c] < 0){
        echo "Zone déjà touché \n";
        return;
    }

    if ($grille[$l][$c] != 0) {
        echo "Touché ! \n";

        // On garde le numéro du bateau avant de rendre la case négative.
        // Ce numéro permet de savoir à quel bateau retirer une vie.
        $bateau = $grille[$l][$c]; 
        $grille[$l][$c] = ($grille[$l][$c]) * -1;

        // Les indices de vie suivent cet ordre : torpilleur, sous-marin 1,
        // sous-marin 2, croiseur, puis porte-avion. Le numéro 9 distingue le second sous-marin.
        if ($bateau == 2){
            $vie[0] = $vie[0]-1;
        }
        if ($bateau == 3){
            $vie[1] = $vie[1]-1;
        }
        if ($bateau == 9){ 
            $vie[2] = $vie[2]-1;
        }
        if ($bateau == 4){
            $vie[3] = $vie[3]-1;
        }
        if ($bateau == 5){
            $vie[4] = $vie[4]-1;
        }

    } else {
        echo "Loupé \n";
        $grille[$l][$c] = "X";
    }
    // Après le tir, on affiche le nombre de cases encore intactes sur chaque bateau.
    echo "Vies restantes : ";
    echo "Torpilleur = {$vie[0]}, ";
    echo "Sous-marin 1 = {$vie[1]}, ";
    echo "Sous-marin 2 = {$vie[2]}, ";
    echo "Croiseur = {$vie[3]}, ";
    echo "Porte-avion = {$vie[4]}\n";
}

// Place le torpilleur sur deux cases. Le nombre 2 permet de le reconnaître lors d’un tir.
// On vérifie la place disponible vers la droite pour une pose horizontale, ou vers le bas sinon.
// Si le placement échoue, la fonction se rappelle pour demander un autre choix.
function positionnetorpilleur(&$grille){
    $l = (int) readline("Sur quelle ligne voulez-vous positionner le torpilleur ?");
    $c = (int) readline("Sur quelle colonne voulez-vous positionner le torpilleur ?: ");
    $position = readline("Voulez-vous positionner le torpilleur en horizontal ? (o/n)");

    // vérifie que le torpilleur ne dépasse pas de la grille
    if ($position == "o") {

        if ($c + 1 <= 9) { 
            if ($grille[$l][$c] == 0 && $grille[$l][$c+1] == 0) {
                $grille[$l][$c] = 2;
                $grille[$l][$c+1] = 2;
                echo "Torpilleur placé horizontalement !\n";
            } else {
                echo "Impossible : une des cases est occupée.\n";
                positionnetorpilleur($grille);
            }
        } else {
            echo "Impossible : le torpilleur dépasse de la grille.\n";
            positionnetorpilleur($grille);
        }

    } else {

        if ($l + 1 <= 9) { 
            if ($grille[$l][$c] == 0 && $grille[$l+1][$c] == 0) {
                $grille[$l][$c] = 2;
                $grille[$l+1][$c] = 2;
                echo "Torpilleur placé verticalement !\n";
            } else {
                echo "Impossible : une des cases est occupée.\n";
                positionnetorpilleur($grille);
            }
        } else {
            echo "Impossible : le torpilleur dépasse de la grille.\n";
            positionnetorpilleur($grille);
        }
    }
}

// Place le croiseur sur quatre cases libres, avec la valeur 4.
// La dernière case est à trois positions du départ : le contrôle utilise donc + 3.
function positionnecroiseur(&$grille){
    $l = (int) readline("Sur quelle ligne voulez-vous positionner le croiseur ? ");
    $c = (int) readline("Sur quelle colonne voulez-vous positionner le croiseur ? ");
    $position = readline("Voulez-vous le mettre horizontal ? (o/n) : ");

    if ($position == "o") {

        if ($c + 3 <= 9) {

            if ($grille[$l][$c] == 0 && $grille[$l][$c+1] == 0 &&
                $grille[$l][$c+2] == 0 && $grille[$l][$c+3] == 0) {

                for ($i = 0; $i < 4; $i++) {
                    $grille[$l][$c + $i] = 4;
                }

                echo "Croiseur placé horizontalement !\n";

            } else {
                echo "Impossible : une des cases est occupée.\n";
                positionnecroiseur($grille);
            }

        } else {
            echo "Impossible : le croiseur dépasse de la grille.\n";
            positionnecroiseur($grille);
        }

    } else { 

        if ($l + 3 <= 9) {

            
            if ($grille[$l][$c] == 0 && $grille[$l+1][$c] == 0 &&
                $grille[$l+2][$c] == 0 && $grille[$l+3][$c] == 0) {

                for ($i = 0; $i < 4; $i++) {
                    $grille[$l + $i][$c] = 4;
                }

                echo "Croiseur placé verticalement !\n";

            } else {
                echo "Impossible : une des cases est occupée.\n";
                positionnecroiseur($grille);
            }

        } else {
            echo "Impossible : le croiseur dépasse de la grille.\n";
            positionnecroiseur($grille);
        }
    }
}

// Place le porte-avion sur cinq cases libres, avec la valeur 5.
// La dernière case est à quatre positions du départ, d’où les vérifications avec + 4.
function positionneporte_avion(&$grille){
    $l = (int) readline("Sur quelle ligne voulez-vous positionner le porte avion ? ");
    $c = (int) readline("Sur quelle colonne voulez-vous positionner le porte avion ? ");
    $position = readline("Voulez-vous le mettre horizontal ? (o/n) : ");

    if ($position == "o") {

        if ($c + 4 <= 9) {

            if (
                $grille[$l][$c] == 0 && 
                $grille[$l][$c+1] == 0 &&
                $grille[$l][$c+2] == 0 && 
                $grille[$l][$c+3] == 0 && 
                $grille[$l][$c+4] == 0
            ){
                for ($i = 0; $i < 5; $i++) {
                    $grille[$l][$c + $i] = 5;
                }

                echo "Porte avion placé horizontalement !\n";

            } else {
                echo "Impossible : une des cases est occupée.\n";
                positionneporte_avion($grille);
            }

        } else {
            echo "Impossible : le porte avion dépasse de la grille.\n";
            positionneporte_avion($grille);
        }

    } else { // vertical

        if ($l + 4 <= 9) {

            if (
                $grille[$l][$c] == 0 && 
                $grille[$l+1][$c] == 0 &&
                $grille[$l+2][$c] == 0 && 
                $grille[$l+3][$c] == 0 && 
                $grille[$l+4][$c] == 0
            ){
                for ($i = 0; $i < 5; $i++) {
                    $grille[$l + $i][$c] = 5;
                }

                echo "Porte avion placé verticalement !\n";

            } else {
                echo "Impossible : une des cases est occupée.\n";
                positionneporte_avion($grille);
            }

        } else {
            echo "Impossible : le porte avion dépasse de la grille.\n";
            positionneporte_avion($grille);
        }
    }
}

// Place le premier sous-marin sur trois cases libres.
// Ses cases portent la valeur 3, utilisée ensuite pour décompter ses vies.
function positionnesous_marins1(&$grille){
    $l = (int) readline("Sur quelle ligne voulez-vous positionner le sous marins ? ");
    $c = (int) readline("Sur quelle colonne voulez-vous positionner le sous marins ? ");
    $position = readline("Voulez-vous le mettre horizontal ? (o/n) : ");

    if ($position == "o") {

        if ($c + 2 <= 9) {

            if ($grille[$l][$c] == 0 && $grille[$l][$c+1] == 0 &&
                $grille[$l][$c+2] == 0){

                for ($i = 0; $i < 3; $i++) {
                    $grille[$l][$c + $i] = 3;
                }

                echo "Sous marins placé horizontalement !\n";

            } else {
                echo "Impossible : une des cases est occupée.\n";
                positionnesous_marins1($grille);
            }

        } else {
            echo "Impossible : le sous marins dépasse de la grille.\n";
            positionnesous_marins1($grille);
        }

    } else { 

        if ($l + 2 <= 9) {

            
            if ($grille[$l][$c] == 0 && $grille[$l+1][$c] == 0 &&
                $grille[$l+2][$c] == 0 ) {

                for ($i = 0; $i < 3; $i++) {
                    $grille[$l + $i][$c] = 3;
                }

                echo "Sous marins placé verticalement !\n";

            } else {
                echo "Impossible : une des cases est occupée.\n";
                positionnesous_marins1($grille);
            }

        } else {
            echo "Impossible : le sous marins dépasse de la grille.\n";
            positionnesous_marins1($grille);
        }
    }
}

// Le deuxième sous-marin occupe aussi trois cases, mais elles portent la valeur 9.
// Ce code permet de le distinguer du premier ; il ne représente pas sa longueur.
function positionnesous_marins2(&$grille){
    $l = (int) readline("Sur quelle ligne voulez-vous positionner le sous marins n°2 ? ");
    $c = (int) readline("Sur quelle colonne voulez-vous positionner le sous marins ? ");
    $position = readline("Voulez-vous le mettre horizontal ? (o/n) : ");

    if ($position == "o") {

        if ($c + 2 <= 9) {

            if ($grille[$l][$c] == 0 && $grille[$l][$c+1] == 0 &&
                $grille[$l][$c+2] == 0){

                for ($i = 0; $i < 3; $i++) {
                    $grille[$l][$c + $i] = 9;
                }

                echo "Sous marins placé horizontalement !\n";

            } else {
                echo "Impossible : une des cases est occupée.\n";
                positionnesous_marins2($grille);
            }

        } else {
            echo "Impossible : le sous marins dépasse de la grille.\n";
            positionnesous_marins2($grille);
        }

    } else { 

        if ($l + 2 <= 9) {

            
            if ($grille[$l][$c] == 0 && $grille[$l+1][$c] == 0 &&
                $grille[$l+2][$c] == 0 ) {

                for ($i = 0; $i < 3; $i++) {
                    $grille[$l + $i][$c] = 9;
                }

                echo "Sous marins placé verticalement !\n";

            } else {
                echo "Impossible : une des cases est occupée.\n";
                positionnesous_marins2($grille);
            }

        } else {
            echo "Impossible : le sous marins dépasse de la grille.\n";
            positionnesous_marins2($grille);
        }
    }
}

// Préparation de la partie : une grille vide et une réserve de vies par joueur.


$grilleJ1 = initialisegrille();
$grilleJ2 = initialisegrille();

// Chaque valeur représente le nombre de cases intactes d’un bateau.
// Les deux joueurs commencent avec les mêmes cinq bateaux et le même total de vies.
$vieJ1 = [2,3,3,4,5];
$vieJ2 = [2,3,3,4,5];

// Ce petit tableau de quatre valeurs est indépendant des grilles des joueurs.
// Il n’est pas utilisé dans la partie qui suit.
$tab[0][0] = 1;
$tab[0][1] = 2;
$tab[1][0] = 3;
$tab[1][1] = 4;

// Le joueur 1 place sa flotte. Les affichages intermédiaires permettent de suivre ses choix.
echo "Grille Joueur 1\n";
affichetab($grilleJ1, 10, 10);
positionnetorpilleur($grilleJ1);
affichetab($grilleJ1, 10, 10);
positionnecroiseur($grilleJ1);
affichetab($grilleJ1, 10, 10);
positionneporte_avion($grilleJ1);
affichetab($grilleJ1, 10, 10);
positionnesous_marins1($grilleJ1);
positionnesous_marins2($grilleJ1);
affichetab($grilleJ1, 10, 10);

// Le joueur 2 prépare ensuite sa propre flotte sur une autre grille.
echo "Grille Joueur 2\n";
affichetab($grilleJ2, 10, 10);
positionnetorpilleur($grilleJ2);
affichetab($grilleJ2, 10, 10);
positionnecroiseur($grilleJ2);
affichetab($grilleJ2, 10, 10);
positionneporte_avion($grilleJ2);
affichetab($grilleJ2, 10, 10);
positionnesous_marins1($grilleJ2);
positionnesous_marins2($grilleJ2);
affichetab($grilleJ2, 10, 10);

// La partie continue tant que les deux flottes ont encore au moins une case intacte.
// On additionne les vies pour savoir si tous les bateaux d’un joueur sont détruits.
while ((array_sum($vieJ1) > 0) && (array_sum($vieJ2) > 0)) {
    echo "--- Nouveau tour ---\n";

    echo "le Joueur 1 tire \n";
    // Le joueur 1 vise la grille du joueur 2 : on modifie donc aussi les vies du joueur 2.
    tire($grilleJ2, $vieJ2);
    // On vérifie la victoire juste après le tir pour arrêter la partie
    // sans donner un nouveau tour au joueur qui vient de perdre.
    if (array_sum($vieJ2) == 0) {
        echo "Joueur 2 est éliminé ! Joueur 1 a gagné !\n";
        break; 
    }

    echo "le Joueur 2 tire \n";
    // Le joueur 2 vise à son tour la grille du joueur 1.
    tire($grilleJ1, $vieJ1);
    if (array_sum($vieJ1) == 0) {
        echo "Joueur 1 est éliminé ! Joueur 2 a gagné !\n";
        break; 
    }
}