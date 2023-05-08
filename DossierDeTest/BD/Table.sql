CREATE TABLE utilisateur
(
    pseudo varchar(25) NOT NULL,
    mdp varchar(255) NOT NULL,
    NumPhoto int (5) NOT NULL,
    PRIMARY KEY (pseudo)
) ENGINE = InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO utilisateur (pseudo, mdp, NumPhoto) VALUES
('Romain', 'Test1', 1);

CREATE TABLE score
(
    IdScore int(255) NOT NULL AUTO_INCREMENT,
    NumJeux int(11) NOT NULL,
    pseudo varchar(25) NOT NULL,
    score int(255) NOT NULL,
    PRIMARY KEY (IdScore)
) ENGINE = InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
