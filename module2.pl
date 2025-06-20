% ================================================================
% dechargement.pl
% Système Prolog de tri des conteneurs pour le déchargement portuaire
% Auteur : [Ton nom]
% Description : Trie une liste de conteneurs selon des critères logiques
% =================================================================

% -----------------------------------------------------------------
% Structure des conteneurs :
% conteneur(Identifiant, Baie, Lateral, Tier, Poids, Destination)
%   - Identifiant : numéro du conteneur
%   - Baie : position longitudinale (avant vers arrière)
%   - Lateral : position latérale (gauche à droite)
%   - Tier : position verticale (de bas en haut)
%   - Poids : poids en kg
%   - Destination : port de destination
% -----------------------------------------------------------------

% -----------------------------------------------------------------
% Comparateur pour le tri :
%   - Priorité au TIER (vertical), décroissant : on décharge les plus en haut
%   - En cas d’égalité : BAIE croissante (ex : on va de l’avant vers l’arrière)
% -----------------------------------------------------------------

% -----------------------------------------------------------------
% Comparateur amélioré : Tier décroissant > Baie croissante > Poids décroissant > Destination
% -----------------------------------------------------------------

compare_conteneurs(Delta, 
                   conteneur(_, Baie1, _, Tier1, Poids1, Dest1), 
                   conteneur(_, Baie2, _, Tier2, Poids2, Dest2)) :-
    ( Tier1 > Tier2 -> Delta = '<' ;
      Tier1 < Tier2 -> Delta = '>' ;
      Baie1 < Baie2 -> Delta = '<' ;
      Baie1 > Baie2 -> Delta = '>' ;
      Poids1 > Poids2 -> Delta = '<' ;
      Poids1 < Poids2 -> Delta = '>' ;
      compare(Delta, Dest1, Dest2)
    ).

% -----------------------------------------------------------------
% trier_conteneurs(+Liste, -ListeTriee)
% Trie une liste de conteneurs selon le comparateur défini
% -----------------------------------------------------------------
trier_conteneurs(Liste, ListeTriee) :-
    predsort(compare_conteneurs, Liste, ListeTriee).

% -----------------------------------------------------------------
% Exemple d’utilisation
% Lancez ?- exemple. pour tester le tri
% -----------------------------------------------------------------

exemple :-
    Liste = [
        conteneur(c1, 10, 2, 3, 15000, douala),
        conteneur(c2, 10, 2, 1, 10000, kribi),
        conteneur(c3, 11, 1, 3, 16000, limbe),
        conteneur(c4, 9, 3, 3, 18000, yaounde),
        conteneur(c5, 9, 3, 3, 18000, bafoussam) % même tier, baie, poids, mais destination différente
    ],
    writeln('Conteneurs initiaux :'), writeln(Liste),
    trier_conteneurs(Liste, ListeTriee),
    writeln('Conteneurs tries (ordre de dechargement) :'), writeln(ListeTriee).

