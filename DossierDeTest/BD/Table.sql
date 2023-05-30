DROP TABLE utilisateur;
DROP TABLE score;

CREATE TABLE utilisateur
(
    pseudo varchar(25) NOT NULL,
    mdp varchar(255) NOT NULL,
    PRIMARY KEY (pseudo)
) ENGINE = InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO utilisateur (pseudo, mdp) VALUES
('Romain', 'Test1');

CREATE TABLE score
(
    IdScore int(255) NOT NULL AUTO_INCREMENT,
    NomJeux varchar(25) NOT NULL,
    pseudo varchar(25) NOT NULL,
    score int(255) NOT NULL,
    PRIMARY KEY (IdScore)
) ENGINE = InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO score (NomJeux, pseudo, score) VALUES
('Overcook', 'Romdem', 100);

INSERT INTO score (NomJeux, pseudo, score) VALUES
('Overcook', 'Max', 200);

INSERT INTO score (NomJeux, pseudo, score) VALUES
('LePotagerDeJerry', 'Noa', 400);
INSERT INTO score (NomJeux, pseudo, score) VALUES
('LePotagerDeJerry', 'Romdem', 300);
