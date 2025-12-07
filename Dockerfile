# Этап сборки
FROM node:22-slim AS builder

WORKDIR /app

# Устанавливаем необходимые зависимости для Prisma
RUN apt-get update -y && apt-get install -y openssl

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

# Продакшн этап
FROM node:22-slim

WORKDIR /app

# Устанавливаем OpenSSL для Prisma и очищаем кеш apt
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Копируем файлы зависимостей
COPY . .

# Устанавливаем только продакшн зависимости
RUN npm ci --only=production

# Копируем собранное приложение из этапа сборки
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Открываем порт приложения
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "run", "start:prod"]
