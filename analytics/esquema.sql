-- Estatísticas do portfólio (16/11/2026). Sem cookies e sem IP: o visitante é um código que muda
-- todo dia (sal sorteado e apagado), então não dá para seguir ninguém de um dia para o outro.
CREATE TABLE IF NOT EXISTS eventos (
  id INTEGER PRIMARY KEY,
  ts INTEGER NOT NULL,          -- momento (ms, UTC)
  dia TEXT NOT NULL,            -- data no horário do Maranhão (AAAA-MM-DD)
  hora INTEGER NOT NULL,        -- 0 a 23, horário do Maranhão
  tipo TEXT NOT NULL,           -- ver | clique | assistente
  nome TEXT NOT NULL DEFAULT '',-- whatsapp, email, instagram, album, stories, abrir, guia...
  rotulo TEXT NOT NULL DEFAULT '',
  caminho TEXT NOT NULL,        -- página onde aconteceu
  origem TEXT NOT NULL DEFAULT '', -- de onde a pessoa veio (Instagram, Google, Direto...)
  campanha TEXT NOT NULL DEFAULT '',
  cidade TEXT NOT NULL DEFAULT '',
  regiao TEXT NOT NULL DEFAULT '',
  pais TEXT NOT NULL DEFAULT '',
  aparelho TEXT NOT NULL DEFAULT '',
  navegador TEXT NOT NULL DEFAULT '',
  sistema TEXT NOT NULL DEFAULT '',
  visitante TEXT NOT NULL       -- código anônimo do dia
);
CREATE INDEX IF NOT EXISTS eventos_dia ON eventos (dia, tipo);
CREATE INDEX IF NOT EXISTS eventos_ts ON eventos (ts);

CREATE TABLE IF NOT EXISTS sais (dia TEXT PRIMARY KEY, valor TEXT NOT NULL);

-- Tentativas de entrar no painel, para barrar quem tenta adivinhar a senha.
CREATE TABLE IF NOT EXISTS tentativas (chave TEXT PRIMARY KEY, n INTEGER NOT NULL, ate INTEGER NOT NULL);
