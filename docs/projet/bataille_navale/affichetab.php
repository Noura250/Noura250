<?php
function affichetab($tab, $m, $n){
	for($i=0; $i<$m; $i++){
		for($j=0; $j<$n; $j++){
			echo $tab[$i][$j]." ";
		}
		echo "\n";
	}
	echo "------------\n";
}

function initialisegrille(){
	$grille = array(); // ajout obligatoire pour initialiser la variable
	for($i=0; $i<10; $i++){
		for($j=0; $j<10; $j++){
			$grille[$i][$j] = 0;
		}
	}
	return $grille;
}

function tire(&$grille, &$vie){
    $l = (int) readline("Sur quelle ligne voulez-vous tirer ? :");
    $c = (int) readline("Sur quelle colonne voulez-vous tirer ?: ");
    
    if ($grille[$l][$c] == "X" or $grille[$l][$c] < 0){
        echo "Zone déjà touché \n";
        return;
    }

    if ($grille[$l][$c] != 0) {
        echo "Touché ! \n";

        $bateau = $grille[$l][$c]; 
        $grille[$l][$c] = ($grille[$l][$c]) * -1;

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
    echo "Vies restantes : ";
    echo "Torpilleur = {$vie[0]}, ";
    echo "Sous-marin 1 = {$vie[1]}, ";
    echo "Sous-marin 2 = {$vie[2]}, ";
    echo "Croiseur = {$vie[3]}, ";
    echo "Porte-avion = {$vie[4]}\n";
}

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

#------------------------------partie----------------------------------------


$grilleJ1 = initialisegrille();
$grilleJ2 = initialisegrille();

$vieJ1 = [2,3,3,4,5];
$vieJ2 = [2,3,3,4,5];

$tab[0][0] = 1;
$tab[0][1] = 2;
$tab[1][0] = 3;
$tab[1][1] = 4;

#mise en place grille joueur 1
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

#mise en place grille joueur 2
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

while ((array_sum($vieJ1) > 0) && (array_sum($vieJ2) > 0)) {
    echo "--- Nouveau tour ---\n";

    echo "le Joueur 1 tire \n";
    tire($grilleJ2, $vieJ2);
    if (array_sum($vieJ2) == 0) {
        echo "Joueur 2 est éliminé ! Joueur 1 a gagné !\n";
        break; 
    }

    echo "le Joueur 2 tire \n";
    tire($grilleJ1, $vieJ1);
    if (array_sum($vieJ1) == 0) {
        echo "Joueur 1 est éliminé ! Joueur 2 a gagné !\n";
        break; 
    }
}