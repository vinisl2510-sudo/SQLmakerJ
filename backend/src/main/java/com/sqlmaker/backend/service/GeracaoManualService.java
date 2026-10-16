package com.sqlmaker.backend.service;

import com.sqlmaker.backend.dto.ArquivoSql;
import com.sqlmaker.backend.dto.ColunaManual;
import com.sqlmaker.backend.dto.GeracaoManualRequest;
import com.sqlmaker.backend.dto.GeracaoManualResponse;
import com.sqlmaker.backend.dto.ReferenciaColuna;
import com.sqlmaker.backend.dto.TabelaManual;
import com.sqlmaker.backend.model.BancoDestino;
import com.sqlmaker.backend.model.TipoColuna;
import com.sqlmaker.backend.service.dialeto.DialetoSql;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/**
 * Gera o script CREATE TABLE a partir das tabelas montadas na tela,
 * na sintaxe do banco escolhido.
 */
@Service
public class GeracaoManualService {

    private final Map<BancoDestino, DialetoSql> dialetos =
            new EnumMap<>(BancoDestino.class);

    private final ValidacaoManualService validacaoManualService;

    public GeracaoManualService(
            List<DialetoSql> dialetos,
            ValidacaoManualService validacaoManualService
    ) {
        for (DialetoSql dialeto : dialetos) {
            this.dialetos.put(dialeto.banco(), dialeto);
        }

        this.validacaoManualService = validacaoManualService;
    }

    public GeracaoManualResponse gerar(GeracaoManualRequest requisicao) {
        DialetoSql dialeto = dialetos.get(requisicao.banco());

        List<TabelaManual> tabelas = requisicao.tabelas().stream()
                .map(this::normalizar)
                .toList();

        validacaoManualService.validar(tabelas, dialeto);

        List<TabelaManual> ordem = ordenar(tabelas);
        Script script = montarScript(ordem, dialeto);

        ArquivoSql arquivo = new ArquivoSql(
                nomeArquivo(requisicao.nomeArquivo()),
                script.conteudo()
        );

        return new GeracaoManualResponse(
                requisicao.banco(),
                dialeto.versao(),
                List.of(arquivo),
                explicar(tabelas, ordem, script.chavesAdiadas(), dialeto)
        );
    }

    /**
     * Cria primeiro as tabelas referenciadas por chaves estrangeiras.
     * Em referências circulares segue a ordem original; as chaves que
     * ainda apontam para tabelas inexistentes vão para o fim do script.
     */
    private List<TabelaManual> ordenar(List<TabelaManual> tabelas) {
        List<TabelaManual> pendentes = new ArrayList<>(tabelas);
        List<TabelaManual> ordem = new ArrayList<>();
        Set<String> criadas = new HashSet<>();

        while (!pendentes.isEmpty()) {
            TabelaManual proxima = pendentes.stream()
                    .filter(tabela -> tabela.colunas().stream()
                            .map(ColunaManual::referencia)
                            .filter(Objects::nonNull)
                            .map(referencia -> chave(referencia.tabela()))
                            .allMatch(alvo -> alvo.equals(chave(tabela.nome()))
                                    || criadas.contains(alvo)))
                    .findFirst()
                    .orElse(pendentes.get(0));

            pendentes.remove(proxima);
            ordem.add(proxima);
            criadas.add(chave(proxima.nome()));
        }

        return ordem;
    }

    private Script montarScript(List<TabelaManual> ordem, DialetoSql dialeto) {
        Map<String, TabelaManual> tabelasPorNome = new HashMap<>();

        for (TabelaManual tabela : ordem) {
            tabelasPorNome.put(chave(tabela.nome()), tabela);
        }

        StringBuilder sql = new StringBuilder()
                .append("-- Gerado pelo SQLmakerJ para ")
                .append(dialeto.nome())
                .append(' ')
                .append(dialeto.versao())
                .append('\n');

        Set<String> criadas = new HashSet<>();
        List<String> chavesAdiadas = new ArrayList<>();

        for (TabelaManual tabela : ordem) {
            // Antes das linhas, para aceitar uma tabela que referencia a si mesma.
            criadas.add(chave(tabela.nome()));

            List<ColunaManual> chavesPrimarias = tabela.colunas().stream()
                    .filter(ColunaManual::chavePrimaria)
                    .toList();

            boolean chavePrimariaSimples = chavesPrimarias.size() == 1;

            int largura = tabela.colunas().stream()
                    .mapToInt(coluna -> coluna.nome().length())
                    .max()
                    .orElse(0);

            List<String> linhas = new ArrayList<>();

            for (ColunaManual coluna : tabela.colunas()) {
                linhas.add(definirColuna(coluna, chavePrimariaSimples, largura, dialeto));
            }

            if (!chavePrimariaSimples) {
                linhas.add("PRIMARY KEY (" + chavesPrimarias.stream()
                        .map(ColunaManual::nome)
                        .collect(Collectors.joining(", ")) + ")");
            }

            for (ColunaManual coluna : tabela.colunas()) {
                if (coluna.referencia() == null) {
                    continue;
                }

                String chaveEstrangeira = chaveEstrangeira(coluna, tabelasPorNome);

                if (criadas.contains(chave(coluna.referencia().tabela()))) {
                    linhas.add(chaveEstrangeira);
                } else {
                    chavesAdiadas.add("ALTER TABLE " + tabela.nome()
                            + " ADD " + chaveEstrangeira + ";");
                }
            }

            sql.append("\nCREATE TABLE ")
                    .append(tabela.nome())
                    .append(" (\n")
                    .append(linhas.stream()
                            .map(linha -> "    " + linha)
                            .collect(Collectors.joining(",\n")))
                    .append("\n);\n");
        }

        for (String comando : chavesAdiadas) {
            sql.append('\n').append(comando).append('\n');
        }

        return new Script(sql.toString(), chavesAdiadas.size());
    }

    private String definirColuna(
            ColunaManual coluna,
            boolean chavePrimariaSimples,
            int largura,
            DialetoSql dialeto
    ) {
        // Nomes alinhados deixam os tipos numa coluna só, mais fácil de ler.
        StringBuilder definicao = new StringBuilder(coluna.nome())
                .append(" ".repeat(largura - coluna.nome().length()))
                .append(' ')
                .append(dialeto.tipo(coluna));

        if (coluna.autoIncremento()) {
            definicao.append(' ').append(dialeto.autoIncremento());
        }

        // A PK já impede NULL; repetir NOT NULL nela só polui o script.
        if (coluna.obrigatorio() && !coluna.chavePrimaria()) {
            definicao.append(" NOT NULL");
        }

        boolean chavePrimariaNaLinha =
                coluna.chavePrimaria() && chavePrimariaSimples;

        if (coluna.unico() && !chavePrimariaNaLinha) {
            definicao.append(" UNIQUE");
        }

        if (chavePrimariaNaLinha) {
            definicao.append(" PRIMARY KEY");
        }

        dialeto.checagem(coluna)
                .ifPresent(checagem -> definicao.append(' ').append(checagem));

        return definicao.toString();
    }

    // FOREIGN KEY separada da coluna: o MySQL ignora REFERENCES escrito na própria coluna.
    private String chaveEstrangeira(
            ColunaManual coluna,
            Map<String, TabelaManual> tabelasPorNome
    ) {
        ReferenciaColuna referencia = coluna.referencia();
        TabelaManual alvo = tabelasPorNome.get(chave(referencia.tabela()));

        ColunaManual colunaAlvo = alvo.colunas().stream()
                .filter(candidata -> chave(candidata.nome()).equals(chave(referencia.coluna())))
                .findFirst()
                .orElseThrow();

        return "FOREIGN KEY (" + coluna.nome() + ") REFERENCES "
                + alvo.nome() + " (" + colunaAlvo.nome() + ")";
    }

    private String explicar(
            List<TabelaManual> tabelas,
            List<TabelaManual> ordem,
            int chavesAdiadas,
            DialetoSql dialeto
    ) {
        List<String> frases = new ArrayList<>();
        String banco = dialeto.nome() + " " + dialeto.versao();

        if (ordem.size() == 1) {
            frases.add("O script cria a tabela " + ordem.get(0).nome()
                    + " no " + banco + ".");
        } else {
            frases.add("O script cria " + ordem.size() + " tabelas no " + banco
                    + ", nesta ordem: "
                    + listar(ordem.stream().map(TabelaManual::nome).toList()) + ".");

            if (!ordem.equals(tabelas)) {
                frases.add("A ordem segue as chaves estrangeiras: cada tabela vem depois das tabelas que ela referencia.");
            }
        }

        if (chavesAdiadas == 1) {
            frases.add("Como há uma referência circular, uma chave estrangeira entra no fim do script, com ALTER TABLE.");
        } else if (chavesAdiadas > 1) {
            frases.add("Como há referências circulares, " + chavesAdiadas
                    + " chaves estrangeiras entram no fim do script, com ALTER TABLE.");
        }

        Set<TipoColuna> tiposUsados = EnumSet.noneOf(TipoColuna.class);

        for (TabelaManual tabela : tabelas) {
            for (ColunaManual coluna : tabela.colunas()) {
                tiposUsados.add(coluna.tipo());
            }
        }

        frases.addAll(dialeto.observacoes(tiposUsados));

        return String.join(" ", frases);
    }

    private String listar(List<String> nomes) {
        if (nomes.size() == 1) {
            return nomes.get(0);
        }

        return String.join(", ", nomes.subList(0, nomes.size() - 1))
                + " e " + nomes.get(nomes.size() - 1);
    }

    // O usuário pode digitar o nome com ou sem a extensão.
    private String nomeArquivo(String nome) {
        return nome.trim().replaceFirst("(?i)\\.sql$", "") + ".sql";
    }

    private TabelaManual normalizar(TabelaManual tabela) {
        return new TabelaManual(
                tabela.nome().trim(),
                tabela.colunas().stream()
                        .map(this::normalizar)
                        .toList()
        );
    }

    private ColunaManual normalizar(ColunaManual coluna) {
        ReferenciaColuna referencia = coluna.referencia() == null
                ? null
                : new ReferenciaColuna(
                        coluna.referencia().tabela().trim(),
                        coluna.referencia().coluna().trim()
                );

        // DECIMAL sem casas decimais informadas vira DECIMAL(n,0).
        Integer escala = coluna.tipo().usaEscala() && coluna.escala() == null
                ? Integer.valueOf(0)
                : coluna.escala();

        return new ColunaManual(
                coluna.nome().trim(),
                coluna.tipo(),
                coluna.tamanho(),
                escala,
                coluna.chavePrimaria(),
                coluna.autoIncremento(),
                coluna.obrigatorio(),
                coluna.unico(),
                referencia
        );
    }

    private String chave(String nome) {
        return nome.toLowerCase(Locale.ROOT);
    }

    private record Script(String conteudo, int chavesAdiadas) {}
}
