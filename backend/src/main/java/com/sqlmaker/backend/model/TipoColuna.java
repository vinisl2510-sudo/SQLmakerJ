package com.sqlmaker.backend.model;

/**
 * Tipos genéricos do modo manual. Cada banco traduz o tipo para a
 * própria sintaxe (por exemplo, VARCHAR vira VARCHAR2 no Oracle).
 */
public enum TipoColuna {
    INT,
    BIGINT,
    VARCHAR,
    CHAR,
    TEXT,
    DECIMAL,
    BOOLEAN,
    DATE,
    DATETIME;

    public boolean usaTamanho() {
        return this == VARCHAR || this == CHAR || this == DECIMAL;
    }

    public boolean usaEscala() {
        return this == DECIMAL;
    }

    public boolean inteiro() {
        return this == INT || this == BIGINT;
    }
}
