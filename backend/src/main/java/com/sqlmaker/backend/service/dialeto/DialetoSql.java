package com.sqlmaker.backend.service.dialeto;

import com.sqlmaker.backend.dto.ColunaManual;
import com.sqlmaker.backend.model.BancoDestino;
import com.sqlmaker.backend.model.TipoColuna;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/** O que muda de um banco para outro na criação de tabelas. */
public interface DialetoSql {

    BancoDestino banco();

    String nome();

    String versao();

    /** Tipo da coluna na sintaxe do banco, já com tamanho e casas decimais. */
    String tipo(ColunaManual coluna);

    /** Cláusula que gera o valor de uma coluna inteira automaticamente. */
    String autoIncremento();

    /** Maior tamanho aceito em VARCHAR e CHAR, ou a maior precisão do DECIMAL. */
    int tamanhoMaximo(TipoColuna tipo);

    int escalaMaxima();

    /** Se o tipo TEXT (ou o equivalente do banco) pode ser PK ou UNIQUE. */
    boolean textoLongoAceitaChave();

    boolean palavraReservada(String nome);

    /** Restrição extra da coluna, como o CHECK que limita o booleano do Oracle a 0 e 1. */
    default Optional<String> checagem(ColunaManual coluna) {
        return Optional.empty();
    }

    /** Frases da explicação sobre como este banco trata os tipos usados. */
    default List<String> observacoes(Set<TipoColuna> tiposUsados) {
        return List.of();
    }

    static Set<String> palavras(String texto) {
        return Arrays.stream(texto.trim().split("\\s+"))
                .map(palavra -> palavra.toUpperCase(Locale.ROOT))
                .collect(Collectors.toUnmodifiableSet());
    }
}
