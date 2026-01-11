# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app
    
COPY package*.json ./
RUN npm install
    
COPY . .
RUN npm run build
    
# ---- production stage ----
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
    
# default nginx config sil
RUN rm -rf ./*
    
COPY --from=build /app/dist .
EXPOSE 80
    
CMD ["nginx", "-g", "daemon off;"]
    
    