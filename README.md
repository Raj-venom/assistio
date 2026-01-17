# AI Full-Stack App Generator ⚡

Generate **full-stack applications** from simple prompts using **programmable AI agents** powered by **Inngest**.  
AI models handle code generation while applications are executed securely inside **cloud sandboxes** using **E2B** and **Docker**.

---

## ✨ Overview

This project enables developers to go from **idea → running application** in minutes.

- Describe your app using a prompt
- AI agents generate components, APIs, and database logic
- Code runs in isolated cloud sandboxes
- Get a live preview with a shareable URL

Built for rapid prototyping, experimentation, and AI-driven development workflows.

---

## 🚀 Tech Stack

### Frontend
- **Next.js 16**
- **React 19**
- **Tailwind CSS v4**
- **shadcn/ui**

### Backend & Infrastructure
- **tRPC** – End-to-end type safety
- **Inngest** – Background jobs & workflow orchestration
- **Inngest Agent Toolkit** – Programmable AI agents
- **Prisma** – ORM
- **Neon** – Serverless PostgreSQL

### Runtime & Execution
- **E2B Cloud Sandboxes** – Secure runtime execution
- **Docker** – Sandbox templating & isolation

### AI
- AI model support for:
  - Component generation
  - Full app scaffolding
  - API and business logic generation

---

## 🧠 Key Features

- 🧱 **Component & App Generation**  
  Generate complete applications or individual components from AI prompts.

- 🧠 **Programmable AI Agents**  
  AI agents coordinate code generation, execution, and validation using Inngest.

- 🔁 **Background Job Processing**  
  Reliable execution of long-running tasks via Inngest workflows.

- 🗂️ **Live Project Preview**  
  Instantly preview generated projects with a public URL.

- 🖥️ **Secure Cloud Sandboxes**  
  Each app runs inside an isolated E2B environment.

- 🐳 **Docker-Based Templates**  
  Reusable Docker templates ensure consistent execution environments.

- 📦 **Database Integration**  
  Prisma + Neon for scalable and serverless database support.

---

## 🏗️ Architecture

```text
Prompt → AI Agent → Code Generation → Sandbox Execution → Live Preview
                ↳ Inngest Workflows
