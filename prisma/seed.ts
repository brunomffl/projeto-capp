import { getAuth } from "firebase-admin/auth";
import { initializeApp } from "firebase-admin/app";
import { prisma } from "../src/database/prisma";
import { Papel } from "@prisma/client";

// Inicializar Firebase
initializeApp();

async function createAdmin() {
    try {
        const adminData = {
            email: "admin@capp.com",
            password: "admin123",
            nome: "Administrador"
        };

        console.log("Criando usuário admin no Firebase...");
        
        // Criar usuário no Firebase
        const firebaseUser = await getAuth().createUser({
            email: adminData.email,
            displayName: adminData.nome,
            password: adminData.password,
        });

        console.log(`Usuário Firebase criado com UID: ${firebaseUser.uid}`);

        // Criar usuário no banco de dados
        const dbUser = await prisma.usuario.create({
            data: {
                firebase_uid: firebaseUser.uid,
                email: adminData.email,
                papel: Papel.admin,
            },
        });

        console.log(`Usuário admin criado no banco de dados com ID: ${dbUser.id}`);
        console.log("Admin criado com sucesso!");
        console.log(`Email: ${adminData.email}`);
        console.log(`Senha: ${adminData.password}`);

    } catch (error) {
        console.error("Erro ao criar admin:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
