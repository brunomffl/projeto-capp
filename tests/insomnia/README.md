# 🧪 Collections do Insomnia - API CAPP

## Como usar:

1. Abra o Insomnia
2. Vá em **Application** > **Preferences** > **Data** > **Import Data**
3. Selecione o arquivo `full-collection.json`
4. Pronto! Todas as rotas estarão disponíveis

## Collections disponíveis:

- **cruds-insomnia.json** - CRUD completo de Usuários e Professores
- **usuarios-collection.json** - Apenas rotas de usuários
- **professores-collection.json** - Apenas rotas de professores

## ⚠️ Antes de testar:
1. Certifique-se que o servidor está rodando: `node src/server.js`
2. Banco de dados configurado e rodando
3. Migrações aplicadas: `npx prisma migrate dev --name create_tables`
