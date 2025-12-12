# RoyalPay Local Backend (Mac)

Bu paket, RoyalPay icin local gelistirmeye hemen baslayabilmen icin hazirlanmis basit bir Node.js API + Docker Compose ortamidir.

## Klasor Yapisi

- docker-compose.yml
- api/
  - Dockerfile
  - .env.docker
  - package.json
  - index.js

## Calistirma (Docker ile)

1. Proje klasorunu ac:
   cd royalpay-local

2. Containerlari olustur ve calistir:
   docker compose up -d --build

3. Tarayici ile test et:
   http://localhost:3000
   http://localhost:3000/health

## Docker olmadan (direkt Node ile)

1. api klasorune gir:
   cd api

2. Paketleri kur:
   npm install

3. Lokal calistir:
   npm run dev

4. Tarayicidan test et:
   http://localhost:3000
