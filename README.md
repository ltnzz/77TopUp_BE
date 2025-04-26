## Setup Database

1. Buat database PostgreSQL dengan nama `mydb`
2. Copy `.env.example` jadi `.env` dan isi sesuai kebutuhan
3. Jalankan migration:
   ```bash
   npx prisma migrate dev
