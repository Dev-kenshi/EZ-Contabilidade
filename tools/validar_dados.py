"""Valida os dados da galaxia antes de publicar. Sai com erro se algo estiver errado.
Uso: python3 tools/validar_dados.py
"""
import json, re, sys
GRUPOS = {'NBC TG','NBC TSP','NBC TA','NBC TR','NBC TO','NBC TSC','NBC TI','NBC TP','NBC PG','NBC PA','NBC PI','NBC PP','NBC TDS','ITG','CTG','CTA','CTO','CTSC'}
TIPOS = {'Emenda Constitucional','Lei Complementar','Decreto','Instrução Normativa','Ato Conjunto','Resolução','Nota Técnica','Marco do calendário','Notícia oficial','Medida Provisória','Portaria'}
PROIBIDOS = ('cfc.org.br/sisweb', 'portalrestore.cfc.org.br')
TRAVESSAO = re.compile('[\\u2014\\u2013]')
erros, avisos = [], []
def err(m): erros.append(m)
def warn(m): avisos.append(m)
def url_ok(u, onde):
    if not u: return
    if not u.startswith('https://'): err(f'{onde}: link sem https: {u}')
    if any(p in u for p in PROIBIDOS): err(f'{onde}: link do sistema antigo do CFC como principal (não abre): {u}')
def texto(it, onde, campos):
    for c in campos:
        v = it.get(c, '')
        if not isinstance(v, str) or not v.strip(): err(f'{onde}: campo "{c}" vazio')
        elif TRAVESSAO.search(v): err(f'{onde}: travessão em "{c}"')
N = json.load(open('data/normas_cfc.json')); R = json.load(open('data/reforma.json'))
vistos = set()
for i, it in enumerate(N):
    onde = f'normas[{i}] {it.get("codigo","?")}'
    texto(it, onde, ['codigo','titulo','grupo','resumo'])
    if it.get('grupo') not in GRUPOS: err(f'{onde}: grupo desconhecido "{it.get("grupo")}"')
    k = it.get('codigo','').upper().replace(' ','')
    if k in vistos: err(f'{onde}: código duplicado')
    vistos.add(k)
    url_ok(it.get('url',''), onde)
    if not it.get('url') and not it.get('pagina_grupo'): err(f'{onde}: sem link e sem página do grupo')
    if len(it.get('resumo','')) > 280: warn(f'{onde}: resumo longo ({len(it["resumo"])} caracteres)')
datas = []
for i, it in enumerate(R):
    onde = f'reforma[{i}] {it.get("codigo","?")}'
    texto(it, onde, ['codigo','titulo','tipo','data','resumo'])
    if it.get('tipo') not in TIPOS: err(f'{onde}: tipo desconhecido "{it.get("tipo")}"')
    if not re.fullmatch(r'\d{4}(-\d{2}-\d{2})?', it.get('data','')): err(f'{onde}: data fora do padrão AAAA ou AAAA-MM-DD')
    if not isinstance(it.get('verificar', False), bool): err(f'{onde}: "verificar" deve ser true/false')
    if it.get('verificar'): warn(f'{onde}: marcado para conferir no texto oficial')
    url_ok(it.get('url',''), onde)
    datas.append(it.get('data',''))
if datas != sorted(datas): err('reforma: itens fora da ordem de data')
print(f'Normas: {len(N)} · Reforma: {len(R)} · Erros: {len(erros)} · Avisos: {len(avisos)}')
for a in avisos: print('  aviso:', a)
for e in erros: print('  ERRO:', e)
sys.exit(1 if erros else 0)
