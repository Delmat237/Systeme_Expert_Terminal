% ----------------------------------------
% Base de Connaissances — Terminal Conteneurs
% Auteur : AZANGUE Leonel Delmat
% Date : Mai 2025
% ----------------------------------------

% ========================================
% === 1. DÉCLARATIONS DES FAITS
% ========================================

% --- NAVIRES ---
% navire(ID, statut, type, longueur, priorité, capacite_evp, tirant_eau).
% priorité = oui | non
navire(n001, arrivee, porte_conteneurs, 300, oui, 3000, 12.5).
navire(n002, pret, porte_conteneurs, 400, non, 1500, 14).
navire(n003, arrivee, militaire, 150, oui, 1000, 10).
navire(n004, arrivee, frigo, 200, oui, 1200, 11).
navire(n006, arrivee, porte_conteneurs, 300, non, 35, 10).
navire(n007, arrivee, porte_conteneurs, 3000, non, 35, 15).
navire(n007, arrivee, porte_conteneurs, 3000, non, 35, 15).
navire(n007, arrivee, porte_conteneurs, 3000, non, 35, 15).
navire(n007, arrivee, porte_conteneurs, 3000, non, 35, 15).
navire(n007, arrivee, porte_conteneurs, 3000, non, 35, 15).


% --- QUAIS ---
% quai(ID, longueur_max, tirant_max, disponible).
quai(q1, 350, 15, oui).
quai(q2, 250, 12.5, oui).

% --- MÉTÉO ---
% meteo(heure, etat).  etat = calme | agitee
meteo(14, calme).

% --- OCCUPATION HORAIRES ---
% heure_occupation(heure, navireID).
heure_occupation(15, n001).

% --- CONTENEURS ---
conteneur(c999, export, dangereux, reefers, zone_c).
% conteneur(ID, flux, danger, type, zone).
conteneur(c001, import, dangereux, reefers, zone_a).
conteneur(c002, export, normal, standard, zone_b).
conteneur(c003, import, normal, standard, zone_c).
conteneur(c005, import, dangereux, divers, zone_a).
conteneur(c010, import, dangereux, reefers, zone_b).  % type reefers


% --- ZONES DE STOCKAGE ---
% zone(nom, type, statut).  statut = disponible | pleine
zone(zone_a, reefers, disponible).
zone(zone_b, standard, pleine).
zone(zone_c, standard, disponible).

% --- TEMPS EN ZONE (Heures) ---
% temps_en_zone(ID_Conteneur, Heures).
temps_en_zone(c001, 72).
temps_en_zone(c002, 12).
temps_en_zone(c003, 24).


% ========================================
% === 2. RÈGLES MÉTIER
% ========================================

% ---------- PLANIFICATION DES NAVIRES ----------

% 1. Planification de l accostage si météo calme et longueur adéquate
planifier_accostage(NavireID, QuaiID) :-
    navire(NavireID, _, _, LongueurN, _, _, _),
    quai(QuaiID, LongueurQ, _, oui),
    LongueurQ >= LongueurN,
    meteo(_, calme).

% 2. Vérification de compatibilité de quai avec tirant d’eau du navire
quai_approprie(NavireID, QuaiID) :-
    navire(NavireID, _, _, Longueur, _, _, Tirant),
    quai(QuaiID, LongQ, TirantMax, oui),
    Longueur =< LongQ,
    Tirant =< TirantMax.

% 3. Définition des navires prioritaires
navire_prioritaire(NavireID) :-
    navire(NavireID, _, _, _, oui, _, _).

% 4. Créneau autorisé pour manœuvre : entre 6h et 22h
creneau_autorise(H) :-
    H >= 6,
    H =< 22.

% 5. Accostage possible si créneau et météo favorables
accostage_possible(NavireID, Heure) :-
    creneau_autorise(Heure),
    meteo(Heure, calme),
    navire(NavireID, arrivee, _, _, _, _, _).

% 6. Accostage interdit si météo agitée
accostage_interdit(NavireID, Heure) :-
    meteo(Heure, agitee),
    navire(NavireID, _, _, _, _, _, _).

% 7. Assignation automatique d’un quai adapté à un navire prioritaire
assigner_quai_si_possible(NavireID, Heure, QuaiID) :-
    navire(NavireID, _, _, Longueur, oui, _, Tirant),
    meteo(Heure, calme),
    quai(QuaiID, LongQ, TirantQ, oui),
    Longueur =< LongQ,
    Tirant =< TirantQ.


% ---------- GESTION DES CONTENEURS ----------

% 8. Isolement requis pour conteneurs dangereux
doit_etre_isole(ContID) :-
    conteneur(ContID, _, dangereux, _, _).

% 9. Affectation de zone réfrigérée pour les reefers
zone_adapte_reefer(ContID, Zone) :-
    conteneur(ContID, _, _, reefers, _),
    zone(Zone, reefers, disponible).

% 10. Prêt à charger : conteneur d export dont la zone est disponible
pret_a_charger(ContID) :-
    conteneur(ContID, export, _, _, Zone),
    zone(Zone, _, disponible).

% 11. Placement anormal : conteneur reefers en zone standard
anomalie_zone(ContID) :-
    conteneur(ContID, _, _, reefers, Zone),
    zone(Zone, standard, _).

% 12. Zone surchargée
zone_surchargee(Zone) :-
    zone(Zone, _, pleine).

% 13. Affectation automatique d’une zone libre selon le type de conteneur
affecter_zone(ContID, Zone) :-
    conteneur(ContID, _, _, Type, _),
    zone(Zone, Type, disponible).

% 14. Prêt à embarquer : conteneur d export, zone dispo et navire prêt
pret_a_embarquer(ContID) :-
    conteneur(ContID, export, _, _, Zone),
    navire(_, pret, _, _, _, _, _),
    zone(Zone, _, disponible).

% 15. Conteneur en attente prolongée (> 48 heures)
attente_prolongee(ContID) :-
    temps_en_zone(ContID, Heures),
    Heures > 48.

% 16. Conflit : deux conteneurs dangereux dans la même zone
conflit_dangereux(C1, C2) :-
    conteneur(C1, _, dangereux, _, Zone),
    conteneur(C2, _, dangereux, _, Zone),
    C1 \= C2.

