import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Listar todos os professores
export const getProfessores = async (req, res) => {
    try {
        const professores = await prisma.professor.findMany({
            include: { usuario: true, oficinas: true },
        });
        res.json(professores);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar professores" });
    }
}

// Buscar professor por id
export const getProfessorById = async (req, res) => {
  try {
    const professor = await prisma.professor.findUnique({
      where: { id: req.params.id },
      include: { usuario: true, oficinas: true },
    });
    if (!professor)
      return res.status(404).json({ error: "Professor não encontrado" });
    res.json(professor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar professor" });
  }
};

// Criar novo professor
export const createProfessor = async (req, res) => {
  try {
    const { usuario_id, nome, cpf } = req.body;
    const professor = await prisma.professor.create({
      data: { usuario_id, nome, cpf },
    });
    res.status(201).json(professor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar professor" });
  }
};

// Atualizar professor
export const updateProfessor = async (req, res) => {
  try {
    const { nome, cpf } = req.body;
    const professor = await prisma.professor.update({
      where: { id: req.params.id },
      data: { nome, cpf },
    });
    res.json(professor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar professor" });
  }
};

// Deletar professor
export const deleteProfessor = async (req, res) => {
  try {
    await prisma.professor.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Professor deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar professor" });
  }
};