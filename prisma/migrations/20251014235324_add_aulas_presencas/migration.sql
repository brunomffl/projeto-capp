-- CreateEnum
CREATE TYPE "public"."StatusPresenca" AS ENUM ('PRESENTE', 'AUSENTE', 'JUSTIFICADA');

-- CreateTable
CREATE TABLE "public"."aulas" (
    "id" TEXT NOT NULL,
    "oficina_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "data" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aulas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."presencas" (
    "id" TEXT NOT NULL,
    "aula_id" TEXT NOT NULL,
    "aluno_id" TEXT NOT NULL,
    "status" "public"."StatusPresenca" NOT NULL DEFAULT 'AUSENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "presencas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "presencas_aula_id_aluno_id_key" ON "public"."presencas"("aula_id", "aluno_id");

-- AddForeignKey
ALTER TABLE "public"."aulas" ADD CONSTRAINT "aulas_oficina_id_fkey" FOREIGN KEY ("oficina_id") REFERENCES "public"."Oficina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."presencas" ADD CONSTRAINT "presencas_aula_id_fkey" FOREIGN KEY ("aula_id") REFERENCES "public"."aulas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."presencas" ADD CONSTRAINT "presencas_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "public"."Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
