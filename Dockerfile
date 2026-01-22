FROM node:22-alpine
RUN npm install -g serve
WORKDIR /app
COPY ./dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]