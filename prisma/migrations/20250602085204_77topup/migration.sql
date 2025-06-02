-- CreateEnum
CREATE TYPE "role_user" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "users" (
    "id_user" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "role" "role_user" NOT NULL DEFAULT 'user',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "admin" (
    "id_admin" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "role" "role_user" NOT NULL DEFAULT 'admin',

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id_admin")
);

-- CreateTable
CREATE TABLE "otp" (
    "id_otp" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT,
    "otp" TEXT,
    "expireat" TIMESTAMP(6),
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "attempt" INTEGER DEFAULT 0,
    "isverified" BOOLEAN DEFAULT false,
    "cooldownuntil" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id_otp")
);

-- CreateTable
CREATE TABLE "games" (
    "id_game" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "image" TEXT,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6),
    "slug" TEXT NOT NULL,
    "type" VARCHAR(10),
    "description" TEXT,
    "isactive" BOOLEAN DEFAULT true,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id_game")
);

-- CreateTable
CREATE TABLE "packages" (
    "id_packages" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "tag" TEXT,
    "gameid" UUID,
    "image" TEXT NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "updatedat" TIMESTAMP(6),
    "isactive" BOOLEAN DEFAULT true,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id_packages")
);

-- CreateTable
CREATE TABLE "midtrans" (
    "id_payment" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" TEXT NOT NULL,
    "useremail" TEXT NOT NULL,
    "paymentmethod" TEXT NOT NULL,
    "gameid" UUID,
    "packageid" UUID,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT DEFAULT 'pending',
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6),
    "redirecturl" TEXT NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id_payment")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "order_id" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "id_packages" VARCHAR(50) NOT NULL,
    "gross_amount" INTEGER NOT NULL,
    "status" VARCHAR(50) DEFAULT 'pending',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "unique_email_admin" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "games_slug_key" ON "games"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "payments_order_id_key" ON "midtrans"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_order_id_key" ON "transactions"("order_id");

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_gameid_fkey" FOREIGN KEY ("gameid") REFERENCES "games"("id_game") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "midtrans" ADD CONSTRAINT "payments_gameid_fkey" FOREIGN KEY ("gameid") REFERENCES "games"("id_game") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "midtrans" ADD CONSTRAINT "payments_packageid_fkey" FOREIGN KEY ("packageid") REFERENCES "packages"("id_packages") ON DELETE CASCADE ON UPDATE NO ACTION;
