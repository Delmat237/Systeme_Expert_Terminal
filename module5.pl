% conteneur(ID, Type, Priorité, Poids, Scelle, AnneeDoc)
conteneur(c1, exportation, 3, 5, oui, 2026).
conteneur(c2, transbordement, 1, 10, non, 2023).
conteneur(c3, exportation, 2, 7, oui, 2025).
conteneur(c4, transbordement, 2, 12, oui, 2026).
conteneur(c5, exportation, 1, 15, non, 2024).

% navire(ID, PrioriteMinimale)
navire(navire1, 3).
navire(navire2, 2).
navire(navire3, 1).

% acteurs
acteur(grutier1, grutier).
acteur(op1, operateur_portique).
acteur(superviseur1, superviseur_chargement).

% Affichage initial automatique
:- initialization(afficher_conteneurs_init).

afficher_conteneurs_init :-
    write('Liste initiale des conteneurs :'), nl,
    forall(conteneur(ID, Type, Prio, Poids, Scelle, Annee),
           (write('- Conteneur '), write(ID),
            write(' | Type: '), write(Type),
            write(' | Priorité: '), write(Prio),
            write(' | Poids: '), write(Poids),
            write(' | Scellé: '), write(Scelle),
            write(' | An. Doc: '), write(Annee), nl)).

% Affectation conteneur → navire selon priorité
affecter_conteneurs(Affectations) :-
    findall((ID, Prio, Poids),
            conteneur(ID, _, Prio, Poids, _, _),
            Conteneurs),
    findall(N, navire(N, _), Navires),
    affecter_liste(Conteneurs, Navires, [], Affectations).

affecter_liste([], _, Acc, Acc).
affecter_liste([(ID, Prio, Poids)|Rest], Navires, Acc, Result) :-
    trouver_navire(ID, Prio, Navires, Navire),
    affecter_liste(Rest, Navires, [(Navire, Poids, ID)|Acc], Result).

trouver_navire(_, Prio, [N|_], N) :-
    navire(N, Min), Prio >= Min, !.
trouver_navire(ID, Prio, [_|R], Result) :-
    trouver_navire(ID, Prio, R, Result).

% Chargement final des navires
charger_tous_les_navires :-
    affecter_conteneurs(Affectations),
    findall(N, navire(N, _), Navires),
    forall(member(Navire, Navires),
           (nl, write('--- Chargement pour '), write(Navire), write(' ---'), nl,
            trouver_conteneurs_pour_navire(Navire, Affectations, Liste),
            sort(0, @>=, Liste, ListeTriee),
            extraire_ids(ListeTriee, IDs),
            charger_liste(IDs))).

trouver_conteneurs_pour_navire(_, [], []).
trouver_conteneurs_pour_navire(N, [(N, Poids, ID)|R], [(Poids, ID)|Rest]) :-
    trouver_conteneurs_pour_navire(N, R, Rest).
trouver_conteneurs_pour_navire(N, [_|R], Rest) :-
    trouver_conteneurs_pour_navire(N, R, Rest).

extraire_ids([], []).
extraire_ids([(_, ID)|R], [ID|Rest]) :-
    extraire_ids(R, Rest).

% Étapes de chargement
recuperer(Conteneur) :-
    write('  → Conteneur '), write(Conteneur), write(' récupéré depuis la cour.'), nl.

transporter_et_charger(Conteneur) :-
    write('  → Conteneur '), write(Conteneur), write(' transporté vers le quai.'), nl,
    write('Chargement via portique STS effectué.'), nl.

verifier(Conteneur) :-
    conteneur(Conteneur, _, _, _, Scelle, Annee),
    ( Scelle == oui ->
        write('Scellé vérifié : le conteneur est scellé'), nl
    ; 
        write('  Scellé : le conteneur est pas scellé'), nl
    ),
    ( Annee >= 2025 ->
        write('Documents : conformes (valide jusqu\'en '), write(Annee), write(').'), nl
    ;
        write('Documents NON conformes (expirés en '), write(Annee), write(').'), nl
    ).

charger_liste([]).
charger_liste([C|R]) :-
    recuperer(C),
    transporter_et_charger(C),
    verifier(C),
    charger_liste(R).
