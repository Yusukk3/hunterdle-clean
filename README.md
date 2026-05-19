# HunterDle — Next.js + Supabase

Jogo fan-made de adivinhação baseado apenas no anime Hunter x Hunter.

## Como rodar localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`.

## Supabase

1. Crie um projeto no Supabase.
2. Rode `supabase/schema.sql` no SQL Editor.
3. Copie a URL e a anon key para `.env.local`.
4. Opcional: ative autenticação por e-mail no painel do Supabase.

## Deploy

Recomendado: Vercel.

Adicione as variáveis:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Observação legal

Este projeto não usa logos, imagens oficiais ou assets protegidos. Os dados são descritivos e limitados ao anime.
