-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "StatusUser" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "PositionUser" AS ENUM ('bidan_praktik', 'bidan_desa', 'bidan_koordinator');

-- CreateTable
CREATE TABLE "user" (
    "user_id" TEXT NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20),
    "email" VARCHAR(255) NOT NULL,
    CONSTRAINT "user_email_key" UNIQUE ("email"),
    "address" VARCHAR(255) NOT NULL,
    "position_user" "PositionUser" NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status_user" "StatusUser" NOT NULL DEFAULT 'INACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);
