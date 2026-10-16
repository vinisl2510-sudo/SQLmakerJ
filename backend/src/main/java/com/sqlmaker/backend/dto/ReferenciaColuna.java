package com.sqlmaker.backend.dto;

import jakarta.validation.constraints.NotBlank;

/** Destino de uma chave estrangeira: tabela e coluna do mesmo pedido. */
public record ReferenciaColuna(

        @NotBlank(message = "Informe a tabela referenciada pela chave estrangeira.")
        String tabela,

        @NotBlank(message = "Informe a coluna referenciada pela chave estrangeira.")
        String coluna

) {}
