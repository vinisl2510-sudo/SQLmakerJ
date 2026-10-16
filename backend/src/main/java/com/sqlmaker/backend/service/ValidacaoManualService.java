package com.sqlmaker.backend.service;

import com.sqlmaker.backend.dto.ColunaManual;
import com.sqlmaker.backend.dto.ReferenciaColuna;
import com.sqlmaker.backend.dto.TabelaManual;
import com.sqlmaker.backend.exception.ModeloManualInvalidoException;
import com.sqlmaker.backend.model.TipoColuna;
import com.sqlmaker.backend.service.dialeto.DialetoSql;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;

/**
 * Confere a estrutura do modo manual antes de gerar o SQL.
 * Junta todos os problemas encontrados para o usuário corrigir de uma vez.
 */
@Service
public class ValidacaoManualService {

    private static final Pattern IDENTIFICADOR =
            Pattern.compile("[A-Za-z][A-Za-z0-9_]*");

    // O PostgreSQL corta nomes acima de 63 caracteres; é o menor limite dos três bancos.
    private static final int TAMANHO_MAXIMO_NOME = 63;

    private static final Locale PT_BR = Locale.forLanguageTag("pt-BR");

    public void validar(List<TabelaManual> tabelas, DialetoSql dialeto) {
        List<String> erros = new ArrayList<>();
        Map<String, TabelaManual> tabelasPorNome = new HashMap<>();
        Set<String> tabelasRepetidas = new LinkedHashSet<>();

        for (TabelaManual tabela : tabelas) {
            validarNome(tabela.nome(), contexto(tabela), dialeto, erros);

            if (tabelasPorNome.putIfAbsent(chave(tabela.nome()), tabela) != null) {
                tabelasRepetidas.add(tabela.nome());
            }
        }

        for (String nome : tabelasRepetidas) {
            erros.add("Há mais de uma tabela chamada \"" + nome + "\".");
        }

        for (TabelaManual tabela : tabelas) {
            validarColunas(tabela, dialeto, erros);
        }

        for (TabelaManual tabela : tabelas) {
            for (ColunaManual coluna : tabela.colunas()) {
                if (coluna.referencia() != null) {
                    validarReferencia(tabela, coluna, tabelasPorNome, dialeto, erros);
                }
            }
        }

        if (!erros.isEmpty()) {
            throw new ModeloManualInvalidoException(erros);
        }
    }

    private void validarColunas(
            TabelaManual tabela,
            DialetoSql dialeto,
            List<String> erros
    ) {
        Set<String> nomes = new HashSet<>();
        Set<String> repetidas = new LinkedHashSet<>();
        List<ColunaManual> chavesPrimarias = new ArrayList<>();
        List<ColunaManual> automaticas = new ArrayList<>();

        for (ColunaManual coluna : tabela.colunas()) {
            String contexto = contexto(tabela, coluna);

            validarNome(coluna.nome(), contexto, dialeto, erros);
            validarTamanho(coluna, contexto, dialeto, erros);

            if (!nomes.add(chave(coluna.nome()))) {
                repetidas.add(coluna.nome());
            }

            if (coluna.chavePrimaria()) {
                chavesPrimarias.add(coluna);
            }

            if (coluna.autoIncremento()) {
                automaticas.add(coluna);
            }

            if (coluna.tipo() == TipoColuna.TEXT
                    && !dialeto.textoLongoAceitaChave()
                    && (coluna.chavePrimaria() || coluna.unico())) {
                erros.add(contexto + ": no " + dialeto.nome() + ", "
                        + dialeto.tipo(coluna)
                        + " não pode ser PK nem Única. Escolha um texto com tamanho.");
            }
        }

        for (String nome : repetidas) {
            erros.add(contexto(tabela) + ": há mais de uma coluna chamada \"" + nome + "\".");
        }

        if (chavesPrimarias.isEmpty()) {
            erros.add(contexto(tabela) + ": marque pelo menos uma coluna como PK.");
        }

        if (automaticas.size() > 1) {
            erros.add(contexto(tabela) + ": só uma coluna pode ser automática.");
        }

        for (ColunaManual coluna : automaticas) {
            boolean unicaChavePrimaria =
                    coluna.chavePrimaria() && chavesPrimarias.size() == 1;

            if (!coluna.tipo().inteiro()) {
                erros.add(contexto(tabela, coluna)
                        + ": só colunas de número inteiro (INT ou BIGINT) podem ser automáticas.");
            } else if (!unicaChavePrimaria && !coluna.unico()) {
                erros.add(contexto(tabela, coluna)
                        + ": uma coluna automática precisa ser a única PK da tabela ou estar marcada como Única.");
            }
        }
    }

    private void validarNome(
            String nome,
            String contexto,
            DialetoSql dialeto,
            List<String> erros
    ) {
        if (!IDENTIFICADOR.matcher(nome).matches()) {
            erros.add(contexto
                    + ": use no nome só letras sem acento, números e _, começando por uma letra.");
        } else if (nome.length() > TAMANHO_MAXIMO_NOME) {
            erros.add(contexto + ": o nome passa de "
                    + TAMANHO_MAXIMO_NOME + " caracteres.");
        } else if (dialeto.palavraReservada(nome)) {
            erros.add(contexto + ": " + nome.toUpperCase(Locale.ROOT)
                    + " é uma palavra reservada no " + dialeto.nome()
                    + ". Escolha outro nome.");
        }
    }

    private void validarTamanho(
            ColunaManual coluna,
            String contexto,
            DialetoSql dialeto,
            List<String> erros
    ) {
        TipoColuna tipo = coluna.tipo();

        if (tipo.usaTamanho()) {
            int maximo = dialeto.tamanhoMaximo(tipo);

            if (coluna.tamanho() == null) {
                erros.add(contexto + ": informe o tamanho.");
            } else if (coluna.tamanho() < 1 || coluna.tamanho() > maximo) {
                erros.add(contexto + ": no " + dialeto.nome()
                        + ", o tamanho vai de 1 a " + numero(maximo) + ".");
            }
        } else if (coluna.tamanho() != null) {
            erros.add(contexto + ": esse tipo não usa tamanho.");
        }

        if (tipo.usaEscala()) {
            int maximo = dialeto.escalaMaxima();

            if (coluna.tamanho() != null && coluna.tamanho() > 0) {
                maximo = Math.min(maximo, coluna.tamanho());
            }

            if (coluna.escala() < 0 || coluna.escala() > maximo) {
                erros.add(contexto + ": as casas decimais vão de 0 a "
                        + numero(maximo) + ".");
            }
        } else if (coluna.escala() != null) {
            erros.add(contexto + ": esse tipo não usa casas decimais.");
        }
    }

    private void validarReferencia(
            TabelaManual tabela,
            ColunaManual coluna,
            Map<String, TabelaManual> tabelasPorNome,
            DialetoSql dialeto,
            List<String> erros
    ) {
        String contexto = contexto(tabela, coluna);
        ReferenciaColuna referencia = coluna.referencia();
        TabelaManual alvo = tabelasPorNome.get(chave(referencia.tabela()));

        if (alvo == null) {
            erros.add(contexto + ": a tabela \"" + referencia.tabela()
                    + "\" não está entre as tabelas do arquivo.");
            return;
        }

        ColunaManual colunaAlvo = alvo.colunas().stream()
                .filter(candidata -> chave(candidata.nome()).equals(chave(referencia.coluna())))
                .findFirst()
                .orElse(null);

        if (colunaAlvo == null) {
            erros.add(contexto + ": a tabela \"" + alvo.nome()
                    + "\" não tem a coluna \"" + referencia.coluna() + "\".");
            return;
        }

        if (colunaAlvo == coluna) {
            erros.add(contexto + ": a coluna não pode referenciar ela mesma.");
            return;
        }

        String nomeAlvo = "\"" + alvo.nome() + "." + colunaAlvo.nome() + "\"";

        long chavesPrimariasAlvo = alvo.colunas().stream()
                .filter(ColunaManual::chavePrimaria)
                .count();

        // Os três bancos só aceitam referência a uma coluna sem valores repetidos.
        boolean alvoSemRepeticao = colunaAlvo.unico()
                || (colunaAlvo.chavePrimaria() && chavesPrimariasAlvo == 1);

        if (!alvoSemRepeticao) {
            erros.add(contexto + ": para ser referenciada, " + nomeAlvo
                    + " precisa ser a única PK da tabela ou estar marcada como Única.");
        }

        // Textos podem ter tamanhos diferentes; números precisam ser idênticos.
        boolean mesmoTipo = coluna.tipo() == colunaAlvo.tipo()
                && (coluna.tipo() != TipoColuna.DECIMAL
                || (Objects.equals(coluna.tamanho(), colunaAlvo.tamanho())
                && Objects.equals(coluna.escala(), colunaAlvo.escala())));

        if (!mesmoTipo) {
            erros.add(contexto + ": o tipo precisa ser igual ao de " + nomeAlvo
                    + " (" + dialeto.tipo(colunaAlvo) + ").");
        }
    }

    private String contexto(TabelaManual tabela) {
        return "Tabela \"" + tabela.nome() + "\"";
    }

    private String contexto(TabelaManual tabela, ColunaManual coluna) {
        return contexto(tabela) + ", coluna \"" + coluna.nome() + "\"";
    }

    private String chave(String nome) {
        return nome.toLowerCase(Locale.ROOT);
    }

    private String numero(int valor) {
        return String.format(PT_BR, "%,d", valor);
    }
}
