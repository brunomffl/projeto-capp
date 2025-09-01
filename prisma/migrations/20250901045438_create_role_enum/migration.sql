/*
  Warnings:

  - Changed the type of `papel` on the `Usuario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Papel" AS ENUM ('admin', 'professor', 'aluno');

-- AlterTable
ALTER TABLE "public"."Usuario" DROP COLUMN "papel",
ADD COLUMN     "papel" "public"."Papel" NOT NULL;
