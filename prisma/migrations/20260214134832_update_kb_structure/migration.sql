/*
  Warnings:

  - You are about to drop the column `catatan` on the `keluarga_berencana` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal` on the `keluarga_berencana` table. All the data in the column will be lost.
  - Added the required column `alat_kontrasepsi` to the `keluarga_berencana` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "keluarga_berencana" DROP COLUMN "catatan",
DROP COLUMN "tanggal",
ADD COLUMN     "alat_kontrasepsi" VARCHAR(50) NOT NULL,
ADD COLUMN     "at" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jumlah_anak_laki" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "jumlah_anak_perempuan" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "keterangan" TEXT,
ADD COLUMN     "tanggal_kunjungan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
