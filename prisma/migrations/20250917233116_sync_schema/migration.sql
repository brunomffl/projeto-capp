/*
  Warnings:

  - You are about to drop the column `dia_semana` on the `Oficina` table. All the data in the column will be lost.
  - You are about to drop the column `horario_fim` on the `Oficina` table. All the data in the column will be lost.
  - You are about to drop the column `horario_inicio` on the `Oficina` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Oficina` table. All the data in the column will be lost.
  - You are about to drop the column `professor_id` on the `Oficina` table. All the data in the column will be lost.
  - Added the required column `capacidade` to the `Oficina` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataFim` to the `Oficina` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataInicio` to the `Oficina` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `Oficina` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instrutorId` to the `Oficina` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `Oficina` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Oficina` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Oficina" DROP CONSTRAINT "Oficina_professor_id_fkey";

-- AlterTable
ALTER TABLE "public"."Oficina" DROP COLUMN "dia_semana",
DROP COLUMN "horario_fim",
DROP COLUMN "horario_inicio",
DROP COLUMN "nome",
DROP COLUMN "professor_id",
ADD COLUMN     "capacidade" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dataFim" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dataInicio" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "descricao" TEXT NOT NULL,
ADD COLUMN     "instrutorId" TEXT NOT NULL,
ADD COLUMN     "titulo" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Oficina" ADD CONSTRAINT "Oficina_instrutorId_fkey" FOREIGN KEY ("instrutorId") REFERENCES "public"."Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
