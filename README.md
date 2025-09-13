# 📚 CAP – Sistema de Gestão de Oficinas Educacionais

> **Future Skills / Robótica** - Plataforma Web para Gestão Educacional

[![Jira](Jira)](https://unochapeco-team-fv4k68oc.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog)
[![Mockups](Mockups)](https://preview-image-analysis-kzmqjdmogju1m08iefsa.vusercontent.net/)

# Passo a Passo pra rodar o projeto
1. Instalar o docker
    Link: https://www.docker.com/get-started/

2. Verificar se a instalação do Docker e Docker Compose funcionou rodando os comandos no terminal no vscode
    ```bash
    docker --version
    docker compose version

3. Se os comandos retornarem as versões, pode seguir com rodando o seguinte comando:
    ```bash
    docker compose up -d

> Esse comando vai fazer a criação do container do banco de dados no docker. 

4. Verifique se o container foi criado certo rodando o seguinte comando:
    ```bash
    docker ps -a

> Se aparecer algo assim:

CONTAINER ID   IMAGE      COMMAND      CREATED     STATUS      PORTS        NAMES
6ccec1217ff8   bitnami/postgresql:latest   "/opt/bitnami/script…"   About a minute ago   Up About a minute   0.0.0.0:5432->5432/tcp, :::5432->5432/tcp   projeto-capp-postgres-1

Deu certo!

5. Agora, crie na raíz do projeto um arquivo .env que contenha isso:
    DATABASE_URL="postgresql://abex:abexcapp@localhost:5432/api-capp?schema=public"
    PORT=3000

7. Depois de ter adicionado o .env, podemos rodar as migrations, para que nosso banco de dados crie as tabelas
    ```bash
    npx prisma migrate dev --name create_tables

8. Rodar o server para testar as rotas.
   ```bash
    npm run dev
   
