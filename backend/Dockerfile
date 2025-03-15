# Folosim Node.js 20
FROM node:20

# Setăm directorul de lucru
WORKDIR /app

# Copiem package.json și package-lock.json și instalăm dependențele
COPY package.json package-lock.json ./
RUN npm install

# Copiem restul fișierelor
COPY . .

# Expunem portul backend-ului
EXPOSE 5000

# Pornim serverul
CMD ["node", "server.js"]
