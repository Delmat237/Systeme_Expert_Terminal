:- begin_tests(terminal_conteneurs).

% Charger la base de connaissances
:- [base_connaissances].

test(isolation_conteneur_dangereux) :-
    doit_etre_isole(c001).

test(isolation_conteneur_non_dangereux, [fail]) :-
    doit_etre_isole(c002).
    writln(c002).

test(quai_approprie_ok) :-
    quai_approprie(n001, q1).

test(quai_approprie_non, [fail]) :-
    quai_approprie(n002, q2).  % Tirant d eau trop élevé

test(navire_prioritaire_oui) :-
    navire_prioritaire(n003).

test(navire_prioritaire_non, [fail]) :-
    navire_prioritaire(n002).

test(creneau_valide) :-
    creneau_autorise(10).

test(creneau_invalide, [fail]) :-
    creneau_autorise(2).

test(accostage_possible_ok) :-
    accostage_possible(n001, 14).

test(anomalie_placement_refer) :-
    anomalie_zone(c010).  % reefers dans zone standard

test(attente_prolongee_oui) :-
    attente_prolongee(c001).

test(attente_prolongee_non, [fail]) :-
    attente_prolongee(c002).

test(conflit_dangereux_oui) :-
    conflit_dangereux(c001, c005).

test(conflit_dangereux_fail, [fail]) :-
    conflit_dangereux(c001, c002).  % c002 n est pas dangereux

:- end_tests(terminal_conteneurs).

