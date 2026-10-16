package com.sqlmaker.backend.controller;

import com.sqlmaker.backend.dto.ArquivoSql;
import com.sqlmaker.backend.dto.DownloadZipRequest;
import com.sqlmaker.backend.exception.ArquivoInvalidoException;
import com.sqlmaker.backend.service.ArquivoService;
import jakarta.validation.Valid;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/arquivos")
public class ArquivoController {

    private final ArquivoService arquivoService;

    public ArquivoController(ArquivoService arquivoService) {
        this.arquivoService = arquivoService;
    }

    @PostMapping(
            value = "/sql",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<byte[]> baixarSql(
            @Valid @RequestBody ArquivoSql arquivo
    ) {
        byte[] conteudo = arquivo.conteudo()
                .getBytes(StandardCharsets.UTF_8);

        String disposicao = ContentDisposition.attachment()
                .filename(arquivo.nome())
                .build()
                .toString();

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, disposicao)
                .contentLength(conteudo.length)
                .body(conteudo);
    }

    @PostMapping(
            value = "/zip",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<byte[]> baixarZip(
            @Valid @RequestBody DownloadZipRequest requisicao
    ) throws IOException {

        byte[] conteudo = arquivoService.gerarZip(requisicao.arquivos());

        String disposicao = ContentDisposition.attachment()
                .filename("SQLmakerJ.zip")
                .build()
                .toString();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/zip"))
                .header(HttpHeaders.CONTENT_DISPOSITION, disposicao)
                .contentLength(conteudo.length)
                .body(conteudo);
    }
    @ExceptionHandler(ArquivoInvalidoException.class)
    public ProblemDetail tratarArquivoInvalido(
            ArquivoInvalidoException erro
    ) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                erro.getMessage()
        );

        problema.setTitle("Pacote de arquivos inválido");

        return problema;
    }

    @ExceptionHandler(IOException.class)
    public ProblemDetail tratarFalhaArquivo(IOException erro) {

        ProblemDetail problema = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Não foi possível preparar o arquivo para download."
        );

        problema.setTitle("Falha ao preparar o download");

        return problema;
    }
}