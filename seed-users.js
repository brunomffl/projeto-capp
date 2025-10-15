import admin from "firebase-admin";
import { readFile } from "fs/promises";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Lê o service account JSON
const serviceAccountJSON = JSON.parse(
  await readFile(new URL("./serviceAccountKey.json", import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountJSON),
});

// ✅ Dados de teste corrigidos
const usersToSeed = [
  {
    email: "admin@sistema-capp.com",
    password: "admin123",
    role: "admin", 
    displayName: "Admin Master",
  },
  {
    email: "prof@sistema-capp.com",
    password: "prof123",
    role: "professor",
    displayName: "Prof. Ana Silva",
    cpf: "12345678900",
  },
];

async function seedUsersAndRoles() {
  console.log("🚀 Iniciando processo de seeding...\n");

  for (const userData of usersToSeed) {
    const { email, password, role, displayName, cpf } = userData;

    let firebaseUid;

    try {
      // Tenta buscar usuário existente no Firebase
      const userRecord = await admin.auth().getUserByEmail(email);
      firebaseUid = userRecord.uid;
      console.log(`⚠️  Usuário já existe no Firebase: ${email}`);
      console.log(`   UID: ${firebaseUid}\n`);
    } catch (err) {
      // Cria novo usuário no Firebase
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
      });
      firebaseUid = userRecord.uid;
      console.log(`✅ Usuário criado no Firebase: ${email}`);
      console.log(`   UID: ${firebaseUid}`);
      console.log(`   Senha: ${password}\n`);
    }

    // ✅ Salva no banco SEM o campo 'nome'
    const novoUsuario = await prisma.usuario.upsert({
      where: { firebase_uid: firebaseUid },
      update: {
        papel: role,
      },
      create: {
        firebase_uid: firebaseUid,
        email,
        papel: role,
      },
    });
    
    console.log(`✅ Usuário salvo no banco (ID: ${novoUsuario.id})`);
    console.log(`   Papel: ${role}\n`);

    // Se for professor, cria registro na tabela Professor
    if (role === "professor") {
      await prisma.professor.upsert({
        where: { usuario_id: novoUsuario.id },
        update: {
          nome: displayName,
          cpf,
        },
        create: {
          usuario_id: novoUsuario.id,
          nome: displayName,
          cpf,
        },
      });
      console.log(`✅ Detalhes do professor salvos\n`);
    }

    console.log("─".repeat(50) + "\n");
  }

  console.log("✅ Processo de seeding concluído!");
  console.log("\n📋 CREDENCIAIS PARA LOGIN:\n");
  console.log("👤 Administrador:");
  console.log("   Email: admin@sistema-capp.com");
  console.log("   Senha: admin123\n");
  console.log("👨‍🏫 Professor:");
  console.log("   Email: prof@sistema-capp.com");
  console.log("   Senha: prof123\n");
  
  await prisma.$disconnect();
}

seedUsersAndRoles().catch((err) => {
  console.error("❌ Erro no seed:", err);
  prisma.$disconnect();
  process.exit(1);
});