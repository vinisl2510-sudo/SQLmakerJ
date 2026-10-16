package com.sqlmaker.backend.service.dialeto;

import com.sqlmaker.backend.dto.ColunaManual;
import com.sqlmaker.backend.model.BancoDestino;
import com.sqlmaker.backend.model.TipoColuna;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class DialetoMysql implements DialetoSql {

    // Palavras marcadas como reservadas (R) na documentação do MySQL 8.0.
    private static final Set<String> RESERVADAS = DialetoSql.palavras("""
            ACCESSIBLE ADD ALL ALTER ANALYZE AND AS ASC ASENSITIVE BEFORE BETWEEN
            BIGINT BINARY BLOB BOTH BY CALL CASCADE CASE CHANGE CHAR CHARACTER CHECK
            COLLATE COLUMN CONDITION CONSTRAINT CONTINUE CONVERT CREATE CROSS CUBE
            CUME_DIST CURRENT_DATE CURRENT_TIME CURRENT_TIMESTAMP CURRENT_USER CURSOR
            DATABASE DATABASES DAY_HOUR DAY_MICROSECOND DAY_MINUTE DAY_SECOND DEC
            DECIMAL DECLARE DEFAULT DELAYED DELETE DENSE_RANK DESC DESCRIBE
            DETERMINISTIC DISTINCT DISTINCTROW DIV DOUBLE DROP DUAL EACH ELSE ELSEIF
            EMPTY ENCLOSED ESCAPED EXCEPT EXISTS EXIT EXPLAIN FALSE FETCH FIRST_VALUE
            FLOAT FLOAT4 FLOAT8 FOR FORCE FOREIGN FROM FULLTEXT FUNCTION GENERATED GET
            GRANT GROUP GROUPING GROUPS HAVING HIGH_PRIORITY HOUR_MICROSECOND
            HOUR_MINUTE HOUR_SECOND IF IGNORE IN INDEX INFILE INNER INOUT INSENSITIVE
            INSERT INT INT1 INT2 INT3 INT4 INT8 INTEGER INTERSECT INTERVAL INTO
            IO_AFTER_GTIDS IO_BEFORE_GTIDS IS ITERATE JOIN JSON_TABLE KEY KEYS KILL
            LAG LAST_VALUE LATERAL LEAD LEADING LEAVE LEFT LIKE LIMIT LINEAR LINES
            LOAD LOCALTIME LOCALTIMESTAMP LOCK LONG LONGBLOB LONGTEXT LOOP
            LOW_PRIORITY MASTER_BIND MASTER_SSL_VERIFY_SERVER_CERT MATCH MAXVALUE
            MEDIUMBLOB MEDIUMINT MEDIUMTEXT MIDDLEINT MINUTE_MICROSECOND MINUTE_SECOND
            MOD MODIFIES NATURAL NOT NO_WRITE_TO_BINLOG NTH_VALUE NTILE NULL NUMERIC
            OF ON OPTIMIZE OPTIMIZER_COSTS OPTION OPTIONALLY OR ORDER OUT OUTER
            OUTFILE OVER PARTITION PERCENT_RANK PRECISION PRIMARY PROCEDURE PURGE
            RANGE RANK READ READS READ_WRITE REAL RECURSIVE REFERENCES REGEXP RELEASE
            RENAME REPEAT REPLACE REQUIRE RESIGNAL RESTRICT RETURN REVOKE RIGHT RLIKE
            ROW ROWS ROW_NUMBER SCHEMA SCHEMAS SECOND_MICROSECOND SELECT SENSITIVE
            SEPARATOR SET SHOW SIGNAL SMALLINT SPATIAL SPECIFIC SQL SQLEXCEPTION
            SQLSTATE SQLWARNING SQL_BIG_RESULT SQL_CALC_FOUND_ROWS SQL_SMALL_RESULT
            SSL STARTING STORED STRAIGHT_JOIN SYSTEM TABLE TERMINATED THEN TINYBLOB
            TINYINT TINYTEXT TO TRAILING TRIGGER TRUE UNDO UNION UNIQUE UNLOCK
            UNSIGNED UPDATE USAGE USE USING UTC_DATE UTC_TIME UTC_TIMESTAMP VALUES
            VARBINARY VARCHAR VARCHARACTER VARYING VIRTUAL WHEN WHERE WHILE WINDOW
            WITH WRITE XOR YEAR_MONTH ZEROFILL
            """);

    @Override
    public BancoDestino banco() {
        return BancoDestino.MYSQL;
    }

    @Override
    public String nome() {
        return "MySQL";
    }

    @Override
    public String versao() {
        return "8.0";
    }

    @Override
    public String tipo(ColunaManual coluna) {
        return switch (coluna.tipo()) {
            case INT -> "INT";
            case BIGINT -> "BIGINT";
            case VARCHAR -> "VARCHAR(" + coluna.tamanho() + ")";
            case CHAR -> "CHAR(" + coluna.tamanho() + ")";
            case TEXT -> "TEXT";
            case DECIMAL -> "DECIMAL(" + coluna.tamanho() + "," + coluna.escala() + ")";
            case BOOLEAN -> "BOOLEAN";
            case DATE -> "DATE";
            case DATETIME -> "DATETIME";
        };
    }

    @Override
    public String autoIncremento() {
        return "AUTO_INCREMENT";
    }

    @Override
    public int tamanhoMaximo(TipoColuna tipo) {
        return switch (tipo) {
            // 65.535 bytes por linha, com até 4 bytes por caractere em utf8mb4.
            case VARCHAR -> 16_383;
            case CHAR -> 255;
            case DECIMAL -> 65;
            default -> 0;
        };
    }

    @Override
    public int escalaMaxima() {
        return 30;
    }

    @Override
    public boolean textoLongoAceitaChave() {
        return false;
    }

    @Override
    public boolean palavraReservada(String nome) {
        return RESERVADAS.contains(nome.toUpperCase(Locale.ROOT));
    }

    @Override
    public List<String> observacoes(Set<TipoColuna> tiposUsados) {
        List<String> observacoes = new ArrayList<>();

        if (tiposUsados.contains(TipoColuna.BOOLEAN)) {
            observacoes.add(
                    "No MySQL, BOOLEAN é um apelido de TINYINT(1): TRUE e FALSE são gravados como 1 e 0."
            );
        }

        return observacoes;
    }
}
