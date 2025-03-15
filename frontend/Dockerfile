# Folosim o imagine de Node.js pentru dezvoltare
FROM node:20

# Setăm directorul de lucru
WORKDIR /app

# Copiem package.json și package-lock.json și instalăm dependențele
COPY package.json package-lock.json ./
RUN npm install

# Copiem restul fișierelor sursă
COPY . .

# Expunem portul React-ului (vite)
EXPOSE 5173

# Pornim frontend-ul
CMD ["npm", "run", "dev"]
