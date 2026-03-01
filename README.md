# DLC Dashboard (React + Vite)

Pequeno projeto React usando Vite que exibe dados de DLCs do Train Simulator.

Quick start

- Instalar dependências:

```bash
npm install
```

- Rodar em desenvolvimento:

```bash
npm run dev
```

- Build para produção:

```bash
npm run build
```

- Pré-deploy / deploy para `gh-pages` (já configurado no `package.json`):

```bash
npm run predeploy
npm run deploy
```

Notas

- O `homepage` em `package.json` e `base` em `vite.config.js` estão definidos para `/dlc-dashboard/` — mantenha esse valor se for publicar no GitHub Pages sob `https://<usuario>.github.io/dlc-dashboard`.
- O arquivo `public/dlcs_train_simulator.csv` está no repositório; se crescer muito (>100MB) considere usar Git LFS ou hospedar externamente.

Extras que você pode querer adicionar

- `LICENSE` se desejar publicar com uma licença (ex.: MIT).
- Personalizar este `README.md` com descrição do projeto e screenshots.
