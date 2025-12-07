# Этап сборки
FROM node:22-slim AS builder

WORKDIR /app

# Устанавливаем необходимые зависимости для Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*


# Копируем файлы зависимостей
COPY package*.json ./
COPY prisma ./prisma/

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код

COPY . .

# Генерируем Prisma клиент и собираем приложение
RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
