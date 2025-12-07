# Этап сборки
FROM node:22-alpine AS builder

WORKDIR /app

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
FROM node:22-alpine

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
COPY prisma ./prisma/

# Устанавливаем только продакшн зависимости
RUN npm ci --only=production

# Копируем собранное приложение из этапа сборки
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Открываем порт приложения
EXPOSE 3000


