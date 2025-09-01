import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Listar todos os usuarios
export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({ 
            include: { professor: true }, 
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuarios" });
    }
}

// Buscar usuario por id
export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.params.id },
      include: { professor: true },
    });
    if (!usuario)
      return res.status(404).json({ error: "Usuario não encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuario" });
  }
};

// Criar novo usuario
export const createUsuario = async (req, res) => {
  try {
    const { firebase_uid, email, papel } = req.body;
    const usuario = await prisma.usuario.create({
      data: { firebase_uid, email, papel },
    });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuario" });
  }
};

// Atualizar usuario
export const updateUsuario = async (req, res) => { 
  try {
    const { firebase_uid, email, papel } = req.body; 
    const usuario = await prisma.usuario.update({
      where: { id: req.params.id },
      data: { firebase_uid, email, papel }, 
    });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuario" });
  }
};

// Deletar usuario
export const deleteUsuario = async (req, res) => {
  try {
    await prisma.usuario.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Usuario deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuario" });
  }
};