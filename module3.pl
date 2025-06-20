% --------------------------------------------
% SYSTÈME EXPERT POUR LA GESTION DE LA COUR
% 		Module 3
% --------------------------------------------

% ------------ Déclarations Dynamiques ------------
:- dynamic vehicule/5, conteneur/8, zone_stockage/5, grue_rtg/4.

% ------------ Base de Faits ------------

% Véhicules (ID, Type, Statut, Position, Capacité)
vehicule(agv01, agv, libre, quai_principal, 20).
vehicule(cam05, camion, libre, parking_nord, 30).
vehicule(chariot01, chariot, occupe, cour_a, 10).


% Conteneurs (ID, Type, Poids, Destination, Position, Zone, statut,Temp)
conteneur(ctn201, standard, 18, export, quai_principal, nil, en_attente,0).
conteneur(ctn202, reefer, 22, import, quai_secondaire, nil,en_transit, -15).

% Zones (Nom, TypesAut, HMax, PriseReefer,Destination)
zone_stockage(zone_a, [standard,dangereux], 5, non,export).
zone_stockage(zone_b, [reefer,standard], 5, oui,import).



% Grues (ID, Zone, Capacité, Statut)
grue_rtg(rtg1, zone_a, 40, libre).

% ------------ Règles de Transport ------------

% Assigner un véhicule à un conteneur
assigner_vehicule(Conteneur, Vehicule) :-
    conteneur(Conteneur, _, Poids, Destination,_, _,en_attente, _),
    vehicule(Vehicule, _, libre, _, Capacite),
    Poids =< Capacite,
    zone_stockage(ZoneDest, _,_,_,Destination),
    update_statut_vehicule(Vehicule, occupe),
    update_statut_conteneur(Conteneur,en_transit),
    
    format("~w assigné à ~w pour ~w.~n", [Conteneur, Vehicule, ZoneDest]).

% Prioriser les exports
prioriser_export(Conteneur) :-
    conteneur(Conteneur, _, _, export, _,_,en_attente, _),
    assigner_vehicule(Conteneur, _).

% ------------ Optimisation d Empilage ------------
% assigner zone en fonction de la destination , et la hauteur max de la zone

assigner_zone(Conteneur, Zone) :-
    conteneur(Conteneur, Type, Poids, Dest, _, nil,_, Temp),
    zone_stockage(Zone, Types, HMax, Prise, Dest),
    member(Type, Types),
    (Type == reefer -> Prise == oui, check_temp(Temp); true), % si le conteneur est reefer alors, si la zone a une prise elect 
    calculer_hauteur(Zone, H),
    H < HMax,
    grue_rtg(_, Zone, Cap, _),
    Poids =< Cap.

calculer_hauteur(Zone, H) :-
    findall(C, conteneur(C, _, _, _, _, Zone,_, _), L),
    length(L, H).
    
    

% Règle 2: Empiler par poids (lourds en bas)

empiler(Conteneur, Dessous) :-
    conteneur(Conteneur, _, Poids1, _, _,_, _), % Récupère le poids du conteneur
    conteneur(Dessous, _, Poids2, _, _,_, _),% Récupère le poids du conteneur dessous
    Poids1 =< Poids2.  % Le conteneur plus léger va au-dessus

% Règle 3: Choisir une grue RTG disponible

choisir_grue(Conteneur, Grue) :-
    conteneur(Conteneur, _, Poids, _,_, _,_, _), % Récupère le poids du conteneur
    grue_rtg(Grue, _, Capacite,_), % Récupère la capacité de la grue
    Poids =< Capacite.


% Règle 4: Gérer les conteneurs réfrigéré

gerer_reefer(Conteneur) :-
    conteneur(Conteneur, reefer, _, _,_, _,_, Temp),
    check_temp(Temp),  % Plage de température valide
    assigner_zone(Conteneur, Zone),
    zone_stockage(Zone, _, _, oui,_).


% ------------ Gestion des Erreurs ------------

check_temp(Temp) :-
    between(-25, 25, Temp) -> true;
    throw(erreur_temperature(Temp)).

update_statut_conteneur(Conteneur, Statut) :-
    retract(conteneur(Conteneur, T, P, D, Pos, Z,_, Temp)),
    assertz(conteneur(Conteneur, T, P, D, Pos, Z, Statut,Temp)).

update_statut_vehicule(Vehicule, Statut) :-
    retract(vehicule(Vehicule, Type, _, Position, Capacite)),
    assertz(vehicule(Vehicule, Type, Statut, Position, Capacite)).

% ------------ Prédicats Utilitaires ------------

surcharge_zone(Zone, Poids_ajoute) :-
    findall(P, (conteneur(_, _, P, _, _, _,_,_), Poids),
    sum_list(Poids, Total),
    grue_rtg(_, Zone, Capacite),
    Total + Poids_ajoute > Capacite).


% ------------ Interface Utilisateur ------------

afficher_etat :-
    findall(C, conteneur(C, _, _, _, _, _,_, _), L),
    length(L, N),
    format('~d conteneurs dans le système~n', [N]),
    listing(vehicule/5).

% ------------ Exécution ------------
:- initialization(main).

main :-
    writeln('Système Yard Operations initialisé'),
    afficher_etat.
