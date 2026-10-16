package com.sqlmaker.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ArquivoSql(

        @NotBlank(message = "Informe o nome do arquivo.")
        @Pattern(
                regexp = "[A-Za-z0-9][A-Za-z0-9_-]*\\.sql",
                message = "Use um nome terminado em .sql, sem espaços ou caminhos."
        )
        String nome,
        @NotBlank(message = "O conteúdo do arquivo não pode ficar vazio.")
        String conteudo

) {}