% ----------------------------------------
% Base de Connaissances — Terminal Conteneurs
% Auteur : Louis Fippo Fitime
% Date : Mai 2025
% ----------------------------------------

% --- Types de conteneurs ---
% conteneur(ID, flux, danger, type, zone).
% === Faits des conteneurs ===
conteneur(c001, import, dangereux, reefers, zone_a).
conteneur(c002, export, normal, standard, zone_b).
conteneur(c003, import, normal, standard, zone_c).
conteneur(c005, import, dangereux, divers, zone_a).
conteneur(c010, import, dangereux, standard, zone_b).

% --- Zones du terminal ---
% zone(Nom, type, statut).
zone(zone_a, reefers, disponible).
zone(zone_b, standard, pleine).
zone(zone_c, standard, disponible).

% --- Navires ---
% navire(ID, statut, capacite).
navire(n001, arrivee, 3000).
navire(n002, pret, 1500).

% --- Temps d’attente (en heures) ---
% temps_en_zone(ID, Heures).
temps_en_zone(c001, 72).
temps_en_zone(c002, 12).
temps_en_zone(c003, 24).

% --- Règles de connaissance métier ---
% === Règles ===

% 1. Un conteneur dangereux doit être isolé
doit_etre_isole(Cont) :-
    conteneur(Cont, _, dangereux, _, _).

% 2. Un conteneur reefers doit être stocké en zone réfrigérée disponible
zone_adapte_reefer(Cont, Zone) :-
    conteneur(Cont, _, _, reefers, _),
    zone(Zone, reefers, disponible).

% 3. Un conteneur d’export peut être chargé si sa zone est disponible
pret_a_charger(Cont) :-
    conteneur(Cont, export, _, _, Zone),
    zone(Zone, _, disponible).

% 4. Détection d’anomalie : conteneur reefers mal placé
anomalie_zone(Cont) :-
    conteneur(Cont, _, _, reefers, Zone),
    zone(Zone, standard, _).

% 5. Zone surchargée (non disponible)
zone_surchargee(Zone) :-
    zone(Zone, _, pleine).

% 6. Affecter automatiquement une zone disponible selon le type du conteneur
affecter_zone(Cont, Zone) :-
    conteneur(Cont, _, _, Type, _),
    zone(Zone, Type, disponible).

% 7. Conteneur prêt à embarquer si le navire est prêt et la zone est disponible
pret_a_embarquer(Cont) :-
    conteneur(Cont, export, _, _, Zone),
    navire(_, pret, _),
    zone(Zone, _, disponible).

% 8. Délai d’attente trop long (> 48h)
attente_prolongee(Cont) :-
    temps_en_zone(Cont, Heures),
    Heures > 48.

% 9. Conflit entre deux conteneurs dangereux dans la même zone
conflit_dangereux(C1, C2) :-
    conteneur(C1, _, dangereux, _, Zone),
    conteneur(C2, _, dangereux, _, Zone),
    C1 \= C2.
