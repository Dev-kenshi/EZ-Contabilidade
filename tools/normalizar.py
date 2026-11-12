"""Normaliza os links da galaxia.
- Links do sistema antigo do CFC (sisweb) nao abrem: viram 'arquivo' (opcional)
  e o link principal passa a ser a pagina oficial do grupo no site do CFC.
- Itens sem link recebem a pagina do grupo.
"""
import json, sys
B = 'https://cfc.org.br/tecnica/normas-brasileiras-de-contabilidade/'
GRUPO_PAG = {
 'NBC TG':'normas-completas/','ITG':'normas-completas/','CTG':'normas-completas/',
 'NBC TSP':'nbc-tsp-do-setor-publico/','NBC TA':'nbc-ta-de-auditoria-independente/','CTA':'nbc-ta-de-auditoria-independente/',
 'NBC TR':'nbc-tr-de-revisao/','NBC TO':'nbc-to-de-asseguracao/','CTO':'nbc-to-de-asseguracao/',
 'NBC TSC':'nbc-tsc-de-servico-correlato/','CTSC':'nbc-tsc-de-servico-correlato/',
 'NBC TI':'nbc-ti-de-auditoria-interna/','NBC PI':'nbc-ti-de-auditoria-interna/','NBC TP':'nbc-tp-de-pericia/',
 'NBC PG':'nbc-pg-geral/','NBC PA':'nbc-pa-do-auditor-independente/','NBC PP':'nbc-pp-do-perito-contabil/',
 'NBC TDS':'nbc-tds-de-sustentabilidade/'}
LENTOS = ('cfc.org.br/sisweb', 'portalrestore.cfc.org.br')
def pagina_grupo(g): return B + GRUPO_PAG.get(g, '')
def run(path):
    d = json.load(open(path))
    n = 0
    for it in d:
        u = it.get('url', '') or ''
        it['pagina_grupo'] = pagina_grupo(it['grupo'])
        if any(x in u for x in LENTOS):
            it['arquivo'] = u; it['url'] = ''; n += 1
    json.dump(d, open(path, 'w'), ensure_ascii=False, indent=1)
    print(f'{path}: {n} links do sistema antigo movidos para "arquivo"')
if __name__ == '__main__':
    run(sys.argv[1] if len(sys.argv) > 1 else 'data/normas_cfc.json')
