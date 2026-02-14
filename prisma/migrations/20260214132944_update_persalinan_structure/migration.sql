/*
  Warnings:

  - You are about to drop the column `tanggal_persalinan` on the `persalinan` table. All the data in the column will be lost.
  - Added the required column `abortus` to the `persalinan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gravida` to the `persalinan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `para` to the `persalinan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggal_partus` to the `persalinan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "persalinan" DROP COLUMN "tanggal_persalinan",
ADD COLUMN     "abortus" INTEGER NOT NULL,
ADD COLUMN     "gravida" INTEGER NOT NULL,
ADD COLUMN     "hb_0" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "para" INTEGER NOT NULL,
ADD COLUMN     "tanggal_partus" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vit_a_bufas" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vit_k" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "keadaan_ibu_persalinan" (
    "id" TEXT NOT NULL,
    "persalinan_id" TEXT NOT NULL,
    "baik" BOOLEAN NOT NULL DEFAULT true,
    "hap" BOOLEAN NOT NULL DEFAULT false,
    "partus_lama" BOOLEAN NOT NULL DEFAULT false,
    "pre_eklamsi" BOOLEAN NOT NULL DEFAULT false,
    "hidup" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "keadaan_ibu_persalinan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keadaan_bayi_persalinan" (
    "id" TEXT NOT NULL,
    "persalinan_id" TEXT NOT NULL,
    "pb" DOUBLE PRECISION,
    "bb" DOUBLE PRECISION,
    "jenis_kelamin" VARCHAR(20) NOT NULL,
    "asfiksia" BOOLEAN NOT NULL DEFAULT false,
    "rds" BOOLEAN NOT NULL DEFAULT false,
    "cacat_bawaan" BOOLEAN NOT NULL DEFAULT false,
    "keterangan_cacat" TEXT,
    "hidup" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "keadaan_bayi_persalinan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "keadaan_ibu_persalinan_persalinan_id_key" ON "keadaan_ibu_persalinan"("persalinan_id");

-- CreateIndex
CREATE UNIQUE INDEX "keadaan_bayi_persalinan_persalinan_id_key" ON "keadaan_bayi_persalinan"("persalinan_id");

-- AddForeignKey
ALTER TABLE "keadaan_ibu_persalinan" ADD CONSTRAINT "keadaan_ibu_persalinan_persalinan_id_fkey" FOREIGN KEY ("persalinan_id") REFERENCES "persalinan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keadaan_bayi_persalinan" ADD CONSTRAINT "keadaan_bayi_persalinan_persalinan_id_fkey" FOREIGN KEY ("persalinan_id") REFERENCES "persalinan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
