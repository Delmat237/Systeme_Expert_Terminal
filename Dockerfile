# Dockerfile
FROM ubuntu:22.04

# Désactive les prompts interactifs
ARG DEBIAN_FRONTEND=noninteractive

# Installer Prolog et Node
RUN apt update && apt install -y swi-prolog curl gnupg nodejs npm

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 5000

CMD ["node", "server.js"]
