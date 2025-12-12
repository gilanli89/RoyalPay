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

## Render'a degisiklik gonderme rehberi

Render ortamina otomatik deploy icin genellikle Render hesabina bagli uzak (remote) bir Git reposuna push yapman yeterlidir. Asagidaki adimlar, mevcut depodaki degisiklikleri Render'in izledigi repoya gondermek icin temel akisi ozetler:

1. Uzak repo baglantisini dogrula veya ekle:
   ```bash
   git remote -v            # origin tanimli mi kontrol et
   git remote add origin <git-url>   # yoksa uzak repoyu ekle
   ```

2. Yerel degisiklikleri temizle ve stage et:
   ```bash
   git status -sb           # izlenmeyen/degisen dosyalari gosterir
   git add -A               # tum degisiklikleri stage et
   git commit -m "Mesaji acik yaz"  # degisiklikleri kaydet
   ```

3. Uzak repoya push yap:
   ```bash
   git push -u origin work  # ilk push icin; sonraki push'larda `git push` yeterli
   ```

4. Render deploy'u tetikle:
   - Render'da repo bagliysa push sonrasi otomatik build/deploy baslar.
   - Otomatik tetiklenmiyorsa Render paneline girip ilgili serviste **Manual Deploy** (Deploy latest commit) dugmesini kullan.

5. Canli kontrol: Deploy tamamlaninca Render log'larini ve uygulama URL'ini kontrol ederek degisikliklerin yayinlandigini dogrula.
