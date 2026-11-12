# EZ Contabilidade

Site pessoal de **Emanuel Luz**, estudante de Ciências Contábeis na UEFS e aprovado no Exame de Suficiência do CFC.

*E de Emanuel. Z de luZ. Contabilidade como ofício.*

## O que tem no site

- **Galáxia das normas:** mapa interativo com 213 Normas Brasileiras de Contabilidade do CFC e 50 atos da reforma tributária (IBS, CBS e Imposto Seletivo). Busca, filtros por grupo, tour guiado e "Norma do dia".
- **Exportar para IA:** copia o resultado filtrado como prompt pronto, Markdown ou JSON.
- **Gamificação:** XP, níveis (de Estagiário a Contador do Amanhã), oito conquistas e um desafio de cinco perguntas. O progresso fica salvo no navegador.
- **Conteúdo gratuito:** Manual do IR 2027, projetos, trajetória e contato.

## Estrutura

```
index.html            site pronto (gerado pelo build)
src/build.py          gera o index.html a partir dos arquivos abaixo
src/galaxy.js|css     galáxia, busca, painel e exportação
src/game.js|css       XP, níveis, conquistas e desafio
data/normas_cfc.json  normas do CFC
data/reforma.json     atos da reforma tributária
data/galaxia.json     dados que o site carrega (gerado pelo build)
data/links_status.json resultado da última verificação de links
tools/                validações e normalização
assets/  brand/       fotos, logo e identidade visual
```

## Como rodar

```bash
python3 src/build.py           # valida os dados e gera index.html
python3 -m http.server 8000    # abra http://localhost:8000
```

## Validações

| Comando | O que confere |
|---|---|
| `python3 tools/validar_dados.py` | Campos obrigatórios, grupos e tipos válidos, datas no padrão, ordem cronológica, códigos duplicados, travessões e links do sistema antigo do CFC como link principal |
| `node tools/validar_links.mjs` | Abre cada link pela internet (Node 18+) e grava `data/links_status.json` |

O build é cancelado se a validação de dados falhar. No GitHub, o workflow `validar.yml` roda as duas validações a cada push e toda segunda-feira.

## Sobre os links

O sistema antigo do CFC (`www1/www2.cfc.org.br/sisweb`) costuma não responder. Por isso, o link principal de cada norma é o texto no Diário Oficial ou a página oficial do grupo no site do CFC. O arquivo `.doc` antigo aparece só como opção extra, marcado como lento.

## Aviso

Conteúdo educativo. Os resumos não substituem o texto oficial nem a orientação de um contador registrado.

## Contato

Instagram: [@emanuelluz.contabilidade](https://www.instagram.com/emanuelluz.contabilidade/) · Links: [emanuelluz.taplink.bio](https://emanuelluz.taplink.bio/)
