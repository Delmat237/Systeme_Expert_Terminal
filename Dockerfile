FROM node:18

# Installer SWI-Prolog
RUN apt-get update && apt-get install -y swi-prolog

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers
COPY . .

# Installer les dépendances
RUN npm install

# Lancer l'application
CMD ["node", "server.js"]

