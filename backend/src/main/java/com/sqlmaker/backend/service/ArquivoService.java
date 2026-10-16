package com.sqlmaker.backend.service;

import com.sqlmaker.backend.dto.ArquivoSql;
import com.sqlmaker.backend.exception.ArquivoInvalidoException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import org.springframework.stereotype.Service;

@Service
public class ArquivoService {

    public byte[] gerarZip(List<ArquivoSql> arquivos) throws IOException {

        validarNomes(arquivos);

        ByteArrayOutputStream saida = new ByteArrayOutputStream();

        try (ZipOutputStream zip = new ZipOutputStream(
                saida,
                StandardCharsets.UTF_8
        )) {
            for (ArquivoSql arquivo : arquivos) {

                ZipEntry entrada = new ZipEntry(arquivo.nome());

                zip.putNextEntry(entrada);

                zip.write(
                        arquivo.conteudo().getBytes(StandardCharsets.UTF_8)
                );

                zip.closeEntry();
            }
        }

        return saida.toByteArray();
    }

    private void validarNomes(List<ArquivoSql> arquivos) {

        Set<String> nomes = new HashSet<>();

        for (ArquivoSql arquivo : arquivos) {

            String nome = arquivo.nome().toLowerCase(Locale.ROOT);

            if (!nomes.add(nome)) {
                throw new ArquivoInvalidoException(
                        "O pacote contém nomes de arquivos repetidos."
                );
            }
        }
    }
}