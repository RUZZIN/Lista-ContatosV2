INSERT INTO nome (id, nome, email, telefone, favorito, grupos) 
VALUES 
(1, 'João Silva', 'joao@email.com', '(11) 99999-1111', true, ARRAY['Família', 'Trabalho']),
(2, 'Maria Santos', 'maria@email.com', '(11) 99999-2222', false, ARRAY['Amigos']),
(3, 'Pedro Oliveira', 'pedro@email.com', '(11) 99999-3333', true, ARRAY['Trabalho']),
(4, 'Ana Pereira', 'ana@email.com', '(11) 99999-4444', false, ARRAY['Família']),
(5, 'Lucas Costa', 'lucas@email.com', '(11) 99999-5555', false, ARRAY['Amigos', 'Faculdade']);

SELECT favorito, id, email, nome, telefone, grupos
FROM public.nome;