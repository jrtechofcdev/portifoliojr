-- 17/11/2026: aparelhos e entradas. Código do aparelho (guardado no navegador) vai em
-- "visitante"; cada entrada (sessão de até 30 minutos sem pausa) em "sessao".
ALTER TABLE eventos ADD COLUMN sessao TEXT NOT NULL DEFAULT '';
ALTER TABLE eventos ADD COLUMN novo INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS eventos_visitante ON eventos (visitante, ts);
CREATE INDEX IF NOT EXISTS eventos_sessao ON eventos (sessao);
