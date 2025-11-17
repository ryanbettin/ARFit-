# ARFit 

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2054-000?logo=expo)](https://docs.expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb?logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#licença)


---

## Discentes
- Silvio Ryan Goncalves Bettin  
- Andrei Lemos Cruz

---

## Proposta
ARFit é um app mobile que promove hábitos saudáveis por meio de treinos, metas e gamificação. Com interface direta e responsiva, atende quem treina em casa, academia ou ao ar livre, oferecendo acompanhamento simples e motivador.

---

## Motivação
Apesar do aumento da conscientização sobre atividade física, muitas pessoas têm dificuldade em manter consistência por falta de motivação, orientação e metas. O ARFit atua nesses pontos com treinos prontos/personalizados, desafios e gamificação com niveis 

---

## MVP
**Objetivo:** validar uma versão funcional com as funções essenciais:
- Treinos prontos e personalizados
- Metas para orientar o usuário
- Gamificação (XP por exercício/meta e evolução de nível)

---

## Requisitos Funcionais
- **RF001 – Cadastro e Autenticação de Usuário:** cadastro por nome, e-mail e senha; autenticação via **JWT**.  
- **RF002 – Listagem de Exercícios:** exibição por categorias (perna, ombro, peito), com nome dos exercícios.  
- **RF003 – Histórico de Exercícios:** registro de treinos com data e progresso, em ordem cronológica.  
- **RF004 – Metas Personalizadas:** metas de repetição/carga com atualização manual de progresso.  
- **RF005 – Perfil:** exibe metas, repetições e cargas concluídas.  
- **RF006 – Gamificação:** XP para cada exercício e/ou meta concluída.

---

## Requisitos Não Funcionais
- **RNF001 – Interface/Usabilidade:** ações principais em até 3 toques; navegação fluida; design responsivo (iOS/Android).  
- **RNF002 – Arquitetura Modular:** separação entre componentes, serviços, rotas e telas.  
- **RNF003 – Segurança:** uso de **JWT** e rotas privadas protegidas.  
- **RNF004 – Portabilidade:** backend **Node.js/Express/Next.js** em qualquer servidor com Node.  
- **RNF005 – Banco Relacional:** **MySQL** com **Prisma ORM** e migrations versionadas.

---

## Monetização
**Parcerias com academias:** licença mensal para uso do sistema pelos alunos da academia.

---

## Tecnologias Utilizadas

| Camada       | Tecnologias                                                                 |
|--------------|------------------------------------------------------------------------------|
| **Front**    | React Native + Expo + TypeScript + React Navigation + Reanimated + Axios + AsyncStorage + Toast |
| **Back**     | Node.js + Express + Prisma + TypeScript + JWT + Bcrypt                       |
| **Banco**    | MySQL (via Prisma ORM)                                                       |
| **Segurança**| JWT (auth), hash de senha com Bcrypt                                         |
| **API**      | REST (Axios)                                                                 |

---


