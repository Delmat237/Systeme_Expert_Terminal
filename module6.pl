 % Faits sur les conteneurs
 conteneur(c1, tchad, 10).
 conteneur(c2, cameroun, 15).
 conteneur(c3, nigeria, 12).

 % Faits sur les acteurs
 chauffeur(jules).
 chauffeur(andre).
 agent_securite(marie).
 transporteur(afritelog).

 % Capacité des moyens de transport
 capacité_transport(camion, 20).
 capacité_transport(train, 50).

  % Etat des infrastructures et congestion
  route(kribi_ndjamena, mauvais).
  route(kribi_yaounde, bon).
  congestion(port, elevée).
  congestion(porte_sud, moyenne).
  congestion(porte_nord, faible).
 
  % Conditions de sortie des conteneurs
 peut_sortir(C) :-
         conteneur(C, Destination, Poids),
         controle_sortie(C),
         choisir_transport(C, Transport),
         format("Le conteneur ~w peut sortir via ~w\n", [C, Transport]).

 % Vérification du contr le de sortie
controle_sortie(c1).
controle_sortie(c2).
controle_sortie(c3).
% Règle pour choisir le transport optimal
choisir_transport(C, camion) :-
 conteneur(C, Destination, Poids),
  capacité_transport(camion, Max),
  Poids =< Max,
  route(kribi_yaounde, bon).
 
choisir_transport(C, train) :-
 conteneur(C, Destination, Poids),
  capacité_transport(train, Max),
  Poids =< Max,
  congestion(port, elevée).
 
  % Règle pour éviter la congestion aux portes
eviter_congestion(C, porte_nord) :-
    congestion(porte_nord, faible),
   format("Le conteneur ~w doit sortir par la porte nord pour éviter la congestion\n", [C]).
 
eviter_congestion(C, porte_sud) :-
 congestion(porte_sud, moyenne),
  format("Le conteneur ~w peut sortir par la porte sud avec un délai modéré\n", [C]).