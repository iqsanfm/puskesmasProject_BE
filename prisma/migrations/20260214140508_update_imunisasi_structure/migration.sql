/*
  Warnings:

  - You are about to drop the column `tanggal` on the `imunisasi` table. All the data in the column will be lost.
  - You are about to alter the column `jenis_imunisasi` on the `imunisasi` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - Added the required column `berat_badan` to the `imunisasi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_orangtua` to the `imunisasi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "imunisasi" DROP COLUMN "tanggal",
ADD COLUMN     "berat_badan" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "nama_orangtua" VARCHAR(255) NOT NULL,
ADD COLUMN     "suhu_badan" DOUBLE PRECISION,
ADD COLUMN     "tgl_imunisasi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "jenis_imunisasi" SET DATA TYPE VARCHAR(50);
