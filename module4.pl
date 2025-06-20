%===========================================
% BASE DE FAITS
%===========================================

% --- Informations de base sur les conteneurs ---
conteneur(c001).
conteneur(c002).
conteneur(c003).

% --- Produits contenus ---
produit(c001, "médicaments").
produit(c002, "vêtements").
produit(c003, "pièces auto").

% --- Ports et pays d'origine ---
port_origine(c001, "Lagos").
pays_origine(c001, "Nigeria").

port_origine(c002, "Rotterdam").
pays_origine(c002, "Pays-Bas").

port_origine(c003, "Shanghai").
pays_origine(c003, "Chine").

% --- Documents fournis ---
document(c001, facture).
document(c001, connaissement).
document(c001, certificat_origine).
document(c001, declaration_camcis).
document(c001, rapport_evaluation).

document(c002, facture).
document(c002, connaissement).
document(c002, certificat_origine).
document(c002, declaration_camcis).
document(c002, rapport_evaluation).

document(c003, facture).
document(c003, connaissement).
document(c003, certificat_origine).
document(c003, rapport_evaluation). % CAMCIS manquant

% --- Validité des documents ---
document_valide(c001, facture).
document_valide(c001, connaissement).
document_valide(c001, certificat_origine).
document_valide(c001, declaration_camcis).
document_valide(c001, rapport_evaluation).

document_valide(c002, facture).
document_valide(c002, connaissement).
document_valide(c002, certificat_origine).
document_valide(c002, declaration_camcis).
document_valide(c002, rapport_evaluation).

document_valide(c003, facture).
document_valide(c003, connaissement).
document_valide(c003, certificat_origine).
document_valide(c003, rapport_evaluation). % CAMCIS invalide ou manquant

% --- Historique de fraude ---
transitaire(c001, transitaire_x).
transitaire(c002, transitaire_y).
transitaire(c003, transitaire_z).

fraude_historique(transitaire_x).
fraude_produit("pièces auto").
fraude_port("Lagos").

% --- Paiement des taxes ---
paiement(c001, effectue).
paiement(c002, effectue).
paiement(c003, non_effectue).

% --- Statut initial des conteneurs ---
etat(c001, inconnu).
etat(c002, inconnu).
etat(c003, inconnu).

%===========================================
% BASE DE CONNAISSANCES
%===========================================

% --- Types de produits et leur traitement douanier ---
type_produit("vêtements", courant).
type_produit("chaussures", courant).
type_produit("médicaments", sensible).
type_produit("pesticides", sensible).
type_produit("pièces auto", strategique).
type_produit("matériel médical", strategique).
type_produit("stupéfiants", interdit).
type_produit("contrefaçons", interdit).
type_produit("armes", declaration_speciale).
type_produit("devises", declaration_speciale).

% --- Niveau de risque des ports ---
risque_port("Rotterdam", faible).
risque_port("Singapour", faible).
risque_port("Lagos", eleve).
risque_port("Douala", eleve).
risque_port("Shanghai", moyen).
risque_port("Abidjan", moyen).

% --- Niveau de risque des pays ---
risque_pays("Pays-Bas", faible).
risque_pays("Singapour", faible).
risque_pays("Nigeria", eleve).
risque_pays("Centrafrique", eleve).
risque_pays("Chine", moyen).
risque_pays("Côte d'Ivoire", moyen).  % Correction de l'apostrophe

% --- Liste des documents requis ---
documents_requis([facture, connaissement, certificat_origine, declaration_camcis, rapport_evaluation]).

% --- Catégories de valeur douanière ---
categorie_valeur("faible").
categorie_valeur("moyenne").
categorie_valeur("élevée").

% --- Contrôles selon le type ---
controle_minimal(Type) :- Type = courant.
controle_rayon_x(Type) :- member(Type, [sensible, strategique, declaration_speciale]).
controle_physique(Type) :- Type = sensible.
controle_bloque(Type) :- Type = interdit.
controle_special(Type) :- Type = declaration_speciale.

% --- Profil de risque global ---
profil_risque_total(C, eleve) :-
    port_origine(C, Port), risque_port(Port, eleve);
    pays_origine(C, Pays), risque_pays(Pays, eleve);
    produit(C, P), fraude_produit(P);
    transitaire(C, T), fraude_historique(T);
    port_origine(C, Port), fraude_port(Port).

profil_risque_total(C, faible) :-
    port_origine(C, Port), risque_port(Port, faible),
    pays_origine(C, Pays), risque_pays(Pays, faible),
    \+ fraude_produit(_),
    \+ fraude_historique(_),
    \+ fraude_port(_).

%===========================================
% RÈGLES DU MOTEUR D’INFÉRENCES
%===========================================

% --- Vérification documentaire ---
documents_complets(C) :-
    documents_requis(Docs),
    forall(member(D, Docs), document(C, D)).

documents_valides(C) :-
    documents_requis(Docs),
    forall(member(D, Docs), document_valide(C, D)).

documents_incomplets(C) :-
    documents_requis(Docs),
    member(D, Docs),
    \+ document(C, D).

document_invalide(C) :-
    document(C, D),
    \+ document_valide(C, D).

declaration_incoherente(C) :-
    \+ document_valide(C, declaration_camcis).

% --- Contrôles selon le produit ---
controle_documentaire(C) :-
    produit(C, P),
    type_produit(P, courant).

controle_rayon_x(C) :-
    produit(C, P),
    type_produit(P, T),
    controle_rayon_x(T).

controle_physique(C) :-
    produit(C, P),
    type_produit(P, T),
    controle_physique(T).

bloque_produit_interdit(C) :-
    produit(C, P),
    type_produit(P, interdit).

procedure_speciale(C) :-
    produit(C, P),
    type_produit(P, declaration_speciale).

% --- Risques port/pays ---
port_risque_eleve(C) :-
    port_origine(C, Port),
    risque_port(Port, eleve).

pays_risque_eleve(C) :-
    pays_origine(C, Pays),
    risque_pays(Pays, eleve).

controle_physique_renforce(C) :-
    port_risque_eleve(C);
    pays_risque_eleve(C).

port_certifie(C) :-
    port_origine(C, Port),
    risque_port(Port, faible).

% --- Historique de fraudes ---
alerte_fraude(C) :-
    transitaire(C, T),
    fraude_historique(T).

controle_fraude_produit(C) :-
    produit(C, P),
    fraude_produit(P).

controle_fraude_port(C) :-
    port_origine(C, Port),
    fraude_port(Port).

controle_renforce(C) :-
    alerte_fraude(C);
    controle_fraude_produit(C);
    controle_fraude_port(C).

% --- Paiement ---
paiement_effectue(C) :-
    paiement(C, effectue).

paiement_non_effectue(C) :-
    paiement(C, non_effectue).

% --- Décisions finales ---
bloque(C) :-
    documents_incomplets(C);
    document_invalide(C);
    bloque_produit_interdit(C);
    paiement_non_effectue(C).

en_attente(C) :-
    declaration_incoherente(C);
    controle_rayon_x(C);
    controle_physique(C);
    controle_renforce(C).

libere(C) :-
    documents_valides(C),
    paiement_effectue(C),
    \+ bloque(C),
    \+ en_attente(C).

etat_final(C, "bloqué") :- bloque(C).
etat_final(C, "en attente") :- \+ bloque(C), en_attente(C).
etat_final(C, "libéré") :- libere(C).
