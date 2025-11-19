/*
  Warnings:

  - You are about to drop the `Parecer` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."StatusParecer" AS ENUM ('RASCUNHO', 'PUBLICADO', 'FINALIZADO');

-- DropForeignKey
ALTER TABLE "public"."Parecer" DROP CONSTRAINT "Parecer_aluno_id_fkey";

-- DropTable
DROP TABLE "public"."Parecer";

-- CreateTable
CREATE TABLE "public"."pareceres" (
    "id" TEXT NOT NULL,
    "aluno_id" TEXT NOT NULL,
    "texto_parecer" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "status" "public"."StatusParecer" NOT NULL DEFAULT 'RASCUNHO',
    "google_doc_id" TEXT,
    "google_doc_url" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,
    "data_publicacao" TIMESTAMP(3),

    CONSTRAINT "pareceres_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pareceres_aluno_id_ano_key" ON "public"."pareceres"("aluno_id", "ano");

-- AddForeignKey
ALTER TABLE "public"."pareceres" ADD CONSTRAINT "pareceres_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "public"."Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
