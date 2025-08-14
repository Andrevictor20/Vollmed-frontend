# Estágio de build
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json .

# Instala as dependências
# Usamos --legacy-peer-deps para evitar problemas com dependências de pares do shadcn/ui
RUN npm install --legacy-peer-deps

# Copia o restante do código da aplicação
COPY . .

# Constrói a aplicação Next.js
RUN npm run build

# Estágio de produção
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os artefatos de build do estágio anterior
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Instala as dependências de produção
# Next.js é necessário em produção para executar o servidor
RUN npm install --omit=dev next

# Expõe a porta que o Next.js usará
EXPOSE 9002

# Comando para iniciar a aplicação
CMD ["npm", "start", "--", "-p", "9002"]
