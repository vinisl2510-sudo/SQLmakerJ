package com.sqlmaker.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record TabelaManual(

        @NotBlank(message = "Toda tabela precisa de um nome.")
        String nome,

        @NotEmpty(message = "Toda tabela precisa de pelo menos uma coluna.")
        @Size(max = 100, message = "Cada tabela pode ter no máximo 100 colunas.")
        List<@NotNull(message = "Envie os dados de cada coluna.") @Valid ColunaManual> colunas

) {}
