# 📚 CAP – Sistema de Gestão de Oficinas Educacionais

> **Future Skills / Robótica** - Plataforma Web para Gestão Educacional

<<<<<<< HEAD
[![Jira](Jira)](https://unochapeco-team-fv4k68oc.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog)
[![Mockups](Mockups)](https://preview-image-analysis-kzmqjdmogju1m08iefsa.vusercontent.net/)
=======
[Jira](https://unochapeco-team-fv4k68oc.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog)
[Mockups](https://preview-image-analysis-kzmqjdmogju1m08iefsa.vusercontent.net/)

## 📋 Índice

- [📖 Contexto](#-contexto)
- [🎯 Objetivo do Sistema](#-objetivo-do-sistema)
- [👥 Público-alvo](#-público-alvo)
- [⚙️ Requisitos Funcionais](#️-requisitos-funcionais)
- [🔧 Considerações Técnicas](#-considerações-técnicas)
- [📅 Fluxo Diário](#-fluxo-diário)

---

## 📖 Contexto

O projeto envolve **oficinas educacionais** oferecidas pela iniciativa **Future Skills**, abrangendo diversas áreas do conhecimento:

- 🤖 **Robótica**
- 🔢 **Matemática**
- ⚗️ **Física**
- 🎨 **Artes**
- 💻 **Tecnologia**

### 🎯 Foco Educacional
As oficinas são voltadas para **crianças e adolescentes**, com metodologia de **aprendizagem prática**.

### 🚨 Problema Atual
- ❌ Falta de estrutura centralizada e integrada
- ❌ Atividades organizadas manualmente
- ❌ Documentos dispersos
- ❌ Dificuldade na padronização
- ❌ Gestão de informações complexa

---

## 🎯 Objetivo do Sistema

Desenvolver um **aplicativo web responsivo** (compatível com dispositivos móveis) que permita:

| Funcionalidade | Descrição |
|----------------|-----------|
| 🏢 **Gestão de Oficinas** | Gerenciar oficinas fixas (8 a 12 por dia) |
| 👨‍🏫 **Organização** | Organizar professores e alunos |
| ✅ **Presença** | Registrar presenças de forma digital |
| 📝 **Pareceres** | Gerar pareceres descritivos personalizados |
| 📄 **Relatórios** | Exportar relatórios em formato Google Docs |
| 📊 **Histórico** | Manter histórico anual completo de cada aluno |

---

## 👥 Público-alvo

### 🎭 Perfis de Usuário

| Perfil | Acesso | Permissões |
|--------|--------|------------|
| 👨‍🏫 **Professores** | ✅ Login Individual | Gestão da própria oficina |
| 🔑 **Administradores** | ✅ Login Administrativo | Gestão completa do sistema |
| 👨‍🎓 **Alunos** | ❌ Sem acesso | - |

> **Nota:** O sistema **não** terá interface para alunos.

---

## ⚙️ Requisitos Funcionais

### 🔐 4.1 Gestão de Usuários

#### 👨‍🏫 **Professores**
- 🔑 Login individual para cada professor
- 🔐 Login com senha genérica (opcional para testes)

**Permissões:**
- ➕ Adicionar/remover alunos da sua oficina
- 👤 Criar novos alunos no sistema
- 🗑️ Deletar alunos
- 📤 Indicar alunos que saíram
- 📝 Registrar parecer anual ou parcial

#### 🔑 **Administradores**
- 🔐 Login administrativo geral

**Permissões:**
- 👨‍🏫 Adicionar/remover professores
- 🏢 Designar professores às oficinas
- 🎯 Gestão completa do sistema

---

### 🏢 4.2 Gestão de Oficinas

#### 📊 **Características das Oficinas**

| Aspecto | Detalhes |
|---------|----------|
| 📈 **Quantidade** | 8 oficinas principais (expansível) |
| 👨‍🏫 **Professor** | 1 professor por oficina |
| 👥 **Alunos** | Alunos únicos por oficina |
| 📅 **Frequência** | 1 vez por semana |
| ⏱️ **Duração** | 4 horas por sessão |

#### 🛠️ **Funcionalidades**
- ✅ Oficinas fixas e nomeáveis
- ➕ Adicionar novas oficinas
- ✏️ Renomear oficinas existentes
- 🗑️ Remover oficinas

---

### 👨‍🎓 4.3 Gestão de Alunos

#### 📊 **Estatísticas**
- 👥 **Total:** 130 a 150 alunos
- 🏢 **Participação:** 1 oficina por aluno
- ⏳ **Permanência:** 3 a 4 anos (média)
- 🔄 **Flexibilidade:** Troca de oficina permitida durante o ano

#### 📝 **Sistema de Pareceres**
- 📅 **Alunos regulares:** Parecer anual completo
- ⏰ **Alunos de meio ano:** Parecer parcial (com justificativa)

#### 📋 **Dados por Aluno**
- 📊 Dados básicos pessoais
- 📅 Histórico completo de presença
- 📝 Parecer atualizado anualmente

---

### ✅ 4.4 Sistema de Frequência

#### 🗓️ **Recursos**
- 📅 **Calendário integrado** para navegação
- 📋 **Aba específica** para chamada
- 📊 **Visualização** do histórico de frequência

#### 👨‍🏫 **Funcionalidades para Professores**
- ✅ Registrar presença por data específica
- 📈 Visualizar histórico completo de frequência
- 📊 Relatórios de presença por período

---

### 📝 4.5 Parecer Descritivo

#### 📋 **Características**
| Aspecto | Especificação |
|---------|---------------|
| 📄 **Formato** | Documento individual por aluno |
| 📅 **Atualização** | Anual |
| 📊 **Extensão** | 8 a 9 páginas |
| 🔄 **Edição** | Direta no aplicativo |

#### 🔧 **Funcionalidades**
- 📝 Criação e edição direta no sistema
- 💾 Download do parecer em PDF
- 📤 Exportação para Google Docs
- ☁️ Integração com Google Drive (opcional)

#### 📤 **Exportação**
- 📄 Download direto do parecer
- 🔗 Exportação para Google Drive
- 📋 Formato padronizado automático

### 🔗 **Integrações**

| Serviço | Tipo | Descrição |
|---------|------|-----------|
| 📄 **Google Docs** | Obrigatória | Exportação de pareceres |
| ☁️ **Google Drive** | Opcional | Armazenamento em nuvem |

### 📋 **Padronização**
- 🎯 Relatórios padronizados independente do estilo de ensino
- 📊 Templates uniformes para pareceres
- 🔄 Processo consistente entre professores

---

### 🔄 **Rotina dos Professores**

#### 🌅 **Acesso ao Sistema**
1. 🔐 **Login** no sistema
2. 📋 **Verificação** da oficina do dia
3. 👥 **Visualização** da lista de alunos

#### ✅ **Gestão da Presença**
1. 📅 **Abertura** da aba de chamada
2. ✅ **Registro** de presença por aluno
3. 💾 **Salvamento** automático dos dados

#### 📝 **Atualização de Pareceres**
1. 👤 **Seleção** do aluno
2. ✏️ **Edição** do parecer descritivo
3. 💾 **Salvamento** das alterações

#### 👥 **Gestão de Alunos**
1. ➕ **Adição** de novos alunos
2. 📤 **Indicação** de saídas
3. 🔄 **Transferências** entre oficinas
>>>>>>> 3e66fc2b3229a112a24247cffc653461b785be03
