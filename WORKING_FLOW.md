# Working Flow Diagram

This diagram illustrates the high‑level interaction between the frontend, backend, database, authentication service, and AI chatbot in the NGO Connect platform.

```mermaid
flowchart LR
    FE[Frontend (React/Vite)] -->|REST API| BE[Backend (Node/Express)]
    BE --> DB[(MongoDB Atlas)]
    BE --> Auth[Auth Service (JWT/OAuth)]
    FE --> Chat[AI Chatbot Service]
```
