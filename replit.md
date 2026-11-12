# EZ Contabilidade

## Preparação após integrar tarefas

O script `tools/post-merge.sh`, configurado como preparação pós-integração, valida os dados e gera o site novamente. Ele não instala dependências nem executa verificações externas de links. Depois dele, o Replit sincroniza os workflows.

## Estrutura e execução

Site estático existente em HTML, CSS e JavaScript, gerado por Python. Mantenha a estrutura e a stack do repositório.

Não há dependências externas a instalar nem segredos necessários para executar o site.

Use o botão Run do Replit. O workflow `Start application` executa:

```bash
python3 src/build.py && python3 -m http.server 5000 --bind 0.0.0.0
```

O build valida os dados e gera `index.html` e `data/galaxia.json`. Se a validação falhar, o servidor não inicia. A prévia usa a porta 5000.

Após alterar os arquivos de origem em `src/` ou os dados, reinicie o workflow para gerar o site novamente. Não edite apenas o HTML gerado.

## Verificações

```bash
python3 tools/validar_dados.py
```

A verificação externa de links é opcional e grava seu resultado em `data/links_status.json`:

```bash
node tools/validar_links.mjs
```
