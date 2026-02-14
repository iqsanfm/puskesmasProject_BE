-- CreateTable
CREATE TABLE "pasien" (
    "pasien_id" TEXT NOT NULL,
    "nik" VARCHAR(16) NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "alamat_lengkap" TEXT NOT NULL,
    "tanggal_lahir" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pasien_pkey" PRIMARY KEY ("pasien_id")
);

-- CreateTable
CREATE TABLE "pemeriksaan_kehamilan" (
    "id" TEXT NOT NULL,
    "practice_id" TEXT NOT NULL,
    "pasien_id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gpa" VARCHAR(20) NOT NULL,
    "umur_kehamilan" INTEGER NOT NULL,
    "status_tt" VARCHAR(50) NOT NULL,
    "jenis_kunjungan" VARCHAR(50) NOT NULL,
    "td" VARCHAR(20) NOT NULL,
    "lila" DOUBLE PRECISION,
    "bb" DOUBLE PRECISION,
    "resti" VARCHAR(50) NOT NULL,
    "catatan" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pemeriksaan_kehamilan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ceklab_reports" (
    "id" TEXT NOT NULL,
    "pemeriksaan_kehamilan_id" TEXT NOT NULL,
    "hiv" BOOLEAN NOT NULL DEFAULT false,
    "hbsag" BOOLEAN NOT NULL DEFAULT false,
    "sifilis" BOOLEAN NOT NULL DEFAULT false,
    "hb" DOUBLE PRECISION,
    "golongan_darah" VARCHAR(5),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ceklab_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persalinan" (
    "id" TEXT NOT NULL,
    "practice_id" TEXT NOT NULL,
    "pasien_id" TEXT NOT NULL,
    "tanggal_persalinan" TIMESTAMP(3) NOT NULL,
    "catatan" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persalinan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keluarga_berencana" (
    "id" TEXT NOT NULL,
    "practice_id" TEXT NOT NULL,
    "pasien_id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "catatan" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "keluarga_berencana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imunisasi" (
    "id" TEXT NOT NULL,
    "practice_id" TEXT NOT NULL,
    "pasien_id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jenis_imunisasi" VARCHAR(100) NOT NULL,
    "catatan" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "imunisasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pasien_nik_key" ON "pasien"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "ceklab_reports_pemeriksaan_kehamilan_id_key" ON "ceklab_reports"("pemeriksaan_kehamilan_id");

-- AddForeignKey
ALTER TABLE "pemeriksaan_kehamilan" ADD CONSTRAINT "pemeriksaan_kehamilan_practice_id_fkey" FOREIGN KEY ("practice_id") REFERENCES "practice_places"("practice_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemeriksaan_kehamilan" ADD CONSTRAINT "pemeriksaan_kehamilan_pasien_id_fkey" FOREIGN KEY ("pasien_id") REFERENCES "pasien"("pasien_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemeriksaan_kehamilan" ADD CONSTRAINT "pemeriksaan_kehamilan_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemeriksaan_kehamilan" ADD CONSTRAINT "pemeriksaan_kehamilan_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ceklab_reports" ADD CONSTRAINT "ceklab_reports_pemeriksaan_kehamilan_id_fkey" FOREIGN KEY ("pemeriksaan_kehamilan_id") REFERENCES "pemeriksaan_kehamilan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persalinan" ADD CONSTRAINT "persalinan_practice_id_fkey" FOREIGN KEY ("practice_id") REFERENCES "practice_places"("practice_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persalinan" ADD CONSTRAINT "persalinan_pasien_id_fkey" FOREIGN KEY ("pasien_id") REFERENCES "pasien"("pasien_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persalinan" ADD CONSTRAINT "persalinan_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persalinan" ADD CONSTRAINT "persalinan_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keluarga_berencana" ADD CONSTRAINT "keluarga_berencana_practice_id_fkey" FOREIGN KEY ("practice_id") REFERENCES "practice_places"("practice_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keluarga_berencana" ADD CONSTRAINT "keluarga_berencana_pasien_id_fkey" FOREIGN KEY ("pasien_id") REFERENCES "pasien"("pasien_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keluarga_berencana" ADD CONSTRAINT "keluarga_berencana_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keluarga_berencana" ADD CONSTRAINT "keluarga_berencana_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imunisasi" ADD CONSTRAINT "imunisasi_practice_id_fkey" FOREIGN KEY ("practice_id") REFERENCES "practice_places"("practice_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imunisasi" ADD CONSTRAINT "imunisasi_pasien_id_fkey" FOREIGN KEY ("pasien_id") REFERENCES "pasien"("pasien_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imunisasi" ADD CONSTRAINT "imunisasi_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imunisasi" ADD CONSTRAINT "imunisasi_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
