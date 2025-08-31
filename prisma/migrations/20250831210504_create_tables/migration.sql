-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" TEXT NOT NULL,
    "firebase_uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "papel" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Professor" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Aluno" (
    "id" TEXT NOT NULL,
    "oficina_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Oficina" (
    "id" TEXT NOT NULL,
    "professor_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dia_semana" TEXT NOT NULL,
    "horario_inicio" TIMESTAMP(3) NOT NULL,
    "horario_fim" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Oficina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Frequencia" (
    "id" TEXT NOT NULL,
    "aluno_id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "presente" BOOLEAN NOT NULL,

    CONSTRAINT "Frequencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Parecer" (
    "id" TEXT NOT NULL,
    "aluno_id" TEXT NOT NULL,
    "texto_parecer" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "data_atualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Parecer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HistoricoOficina" (
    "id" TEXT NOT NULL,
    "aluno_id" TEXT NOT NULL,
    "oficina_id" TEXT NOT NULL,
    "data_entrada" TIMESTAMP(3) NOT NULL,
    "data_saida" TIMESTAMP(3),

    CONSTRAINT "HistoricoOficina_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_firebase_uid_key" ON "public"."Usuario"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_usuario_id_key" ON "public"."Professor"("usuario_id");

-- AddForeignKey
ALTER TABLE "public"."Professor" ADD CONSTRAINT "Professor_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Aluno" ADD CONSTRAINT "Aluno_oficina_id_fkey" FOREIGN KEY ("oficina_id") REFERENCES "public"."Oficina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Oficina" ADD CONSTRAINT "Oficina_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "public"."Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Frequencia" ADD CONSTRAINT "Frequencia_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "public"."Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Parecer" ADD CONSTRAINT "Parecer_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "public"."Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistoricoOficina" ADD CONSTRAINT "HistoricoOficina_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "public"."Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistoricoOficina" ADD CONSTRAINT "HistoricoOficina_oficina_id_fkey" FOREIGN KEY ("oficina_id") REFERENCES "public"."Oficina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
