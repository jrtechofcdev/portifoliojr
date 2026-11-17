-- Estatísticas do portfólio (16/11/2026; aparelhos e entradas em 17/11/2026). Sem cookies e sem IP.
-- Instalação nova: este arquivo. Banco já existente: migracao-002.sql.
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
  visitante TEXT NOT NULL,      -- código anônimo do aparelho (ou do dia, sem armazenamento)
  sessao TEXT NOT NULL DEFAULT '', -- entrada: termina depois de 30 minutos sem atividade
  novo INTEGER NOT NULL DEFAULT 0  -- 1 no primeiro evento de um aparelho
);
CREATE INDEX IF NOT EXISTS eventos_dia ON eventos (dia, tipo);
CREATE INDEX IF NOT EXISTS eventos_ts ON eventos (ts);
CREATE INDEX IF NOT EXISTS eventos_visitante ON eventos (visitante, ts);
CREATE INDEX IF NOT EXISTS eventos_sessao ON eventos (sessao);

CREATE TABLE IF NOT EXISTS sais (dia TEXT PRIMARY KEY, valor TEXT NOT NULL);

-- Tentativas de entrar no painel, para barrar quem tenta adivinhar a senha.
CREATE TABLE IF NOT EXISTS tentativas (chave TEXT PRIMARY KEY, n INTEGER NOT NULL, ate INTEGER NOT NULL);
