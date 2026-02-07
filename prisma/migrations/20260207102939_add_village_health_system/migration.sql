/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20),
    "email" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "position_user" "PositionUser",
    "village_id" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status_user" "StatusUser" NOT NULL DEFAULT 'INACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "villages" (
    "village_id" TEXT NOT NULL,
    "nama_desa" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "villages_pkey" PRIMARY KEY ("village_id")
);

-- CreateTable
CREATE TABLE "practice_places" (
    "practice_id" TEXT NOT NULL,
    "nama_praktik" VARCHAR(255) NOT NULL,
    "village_id" TEXT NOT NULL,
    "alamat" VARCHAR(255) NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_places_pkey" PRIMARY KEY ("practice_id")
);

-- CreateTable
CREATE TABLE "health_data" (
    "data_id" TEXT NOT NULL,
    "practice_id" TEXT NOT NULL,
    "nama_pasien" VARCHAR(255) NOT NULL,
    "umur_pasien" INTEGER,
    "jenis_data" VARCHAR(100) NOT NULL,
    "catatan" TEXT,
    "tanggal_periksa" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_verifikasi" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "diverifikasi_oleh" TEXT,
    "tanggal_verifikasi" TIMESTAMP(3),
    "alasan_penolakan" TEXT,
    "jumlah_revisi" INTEGER NOT NULL DEFAULT 0,
    "alasan_reject_terakhir" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "health_data_pkey" PRIMARY KEY ("data_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "practice_places_user_id_key" ON "practice_places"("user_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "villages"("village_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_places" ADD CONSTRAINT "practice_places_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "villages"("village_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_places" ADD CONSTRAINT "practice_places_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_data" ADD CONSTRAINT "health_data_practice_id_fkey" FOREIGN KEY ("practice_id") REFERENCES "practice_places"("practice_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_data" ADD CONSTRAINT "health_data_diverifikasi_oleh_fkey" FOREIGN KEY ("diverifikasi_oleh") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
