-- Banco D1 da escolha das fotos pelas modelos (Worker em escolha/).
-- albuns: um link secreto (token) por pasta de ensaio, com a lista de fotos.
-- escolhas: o que a modelo marcou em cada foto. estado: 'album', 'destaque', 'nao' ou '' (sem marca).
-- origem: 'site' quando veio pré-marcada (já está no portfólio), 'modelo' quando ela tocou.
CREATE TABLE IF NOT EXISTS albuns (
  sigla TEXT PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  fotos TEXT NOT NULL,
  concluido TEXT
);

CREATE TABLE IF NOT EXISTS escolhas (
  sigla TEXT NOT NULL,
  arquivo TEXT NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('album', 'destaque', 'nao', '')),
  quando INTEGER NOT NULL,
  origem TEXT NOT NULL DEFAULT 'modelo',
  PRIMARY KEY (sigla, arquivo)
);
