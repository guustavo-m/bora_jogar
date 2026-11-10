create table usuarios (
    id serial primary key,
    nome varchar(100) not null,
    email varchar(150) not null unique,
    senha varchar(255) not null,
    tipo varchar(20) default 'user',
    criado_em timestamp default current_timestamp
);

select * from usuarios

insert into usuarios (nome, email, senha, tipo) values
('Usuário', 'usuario@gmail.com', '$2b$10$QLyuyqCdmVOrgKh1qgzOL.cWxb1JTbdaXR9FRE5/HefN2Q99P1ac.', 'admin')

create table esportes (
    id serial primary key,
    nome varchar(50) not null unique
);

create table partidas (
    id serial primary key,
    nome varchar(150) not null,
    esporte_id integer not null,
    organizador_id integer not null,
    data date not null,
    horario time not null,
    local varchar(200) not null,
    max_participantes integer not null,
    descricao text,
    criado_em timestamp default current_timestamp,

    constraint fk_partida_esporte
        foreign key (esporte_id)
        references esportes(id),

    constraint fk_partida_organizador
        foreign key (organizador_id)
        references usuarios(id),

    constraint chk_max_participantes
        check (max_participantes > 0)
);

create table participacoes (
    id serial primary key,
    partida_id integer not null,
    usuario_id integer not null,
    status varchar(20) default 'pendente',
    solicitado_em timestamp default current_timestamp,

    constraint fk_participacao_partida
        foreign key (partida_id)
        references partidas(id)
        on delete cascade,

    constraint fk_participacao_usuario
        foreign key (usuario_id)
        references usuarios(id)
        on delete cascade,

    constraint chk_status_participacao
        check (status in ('pendente', 'aprovado', 'rejeitado', 'cancelado')),

    constraint uk_participacao
        unique (partida_id, usuario_id)
);

insert into esportes (nome) values
('Futebol'),
('Vôlei'),
('Basquete'),
('Futsal'),
('Tênis'),
('Handebol'),
('Vôlei de praia'),
('Beach tennis');

insert into partidas (
    nome,
    esporte_id,
    organizador_id,
    data,
    horario,
    local,
    max_participantes,
    descricao
) values
(
    'Futebol de quarta',
    (select id from esportes where nome = 'Futebol'),
    1,
    '2026-11-18',
    '19:30',
    'Arena Vila Madalena',
    12,
    'Jogo amistoso para jogadores de todos os níveis.'
),
(
    'Vôlei no parque',
    (select id from esportes where nome = 'Vôlei'),
    1,
    '2026-11-19',
    '09:00',
    'Parque Villa-Lobos',
    12,
    'Partida amistosa de vôlei.'
),
(
    'Basquete 3x3',
    (select id from esportes where nome = 'Basquete'),
    1,
    '2026-11-20',
    '17:00',
    'Quadra da Mooca',
    6,
    'Partida de basquete 3x3.'
);

insert into participacoes (
    partida_id,
    usuario_id,
    status
) values
(1, 2, 'aprovado'),
(1, 3, 'pendente');