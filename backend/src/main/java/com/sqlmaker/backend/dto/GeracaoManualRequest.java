package com.sqlmaker.backend.dto;

import com.sqlmaker.backend.model.BancoDestino;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;

public record GeracaoManualRequest(

        @NotNull(message = "Informe o banco de destino.")
        BancoDestino banco,

        @NotBlank(message = "Informe o nome do arquivo.")
        @Size(
                max = 100,
                message = "O nome do arquivo deve ter no máximo 100 caracteres."
        )
        @Pattern(
                regexp = "[A-Za-z0-9][A-Za-z0-9_-]*(\\.[Ss][Qq][Ll])?",
                message = "Use no nome do arquivo só letras sem acento, números, hífen e sublinhado."
        )
        String nomeArquivo,

        @NotEmpty(message = "Adicione pelo menos uma tabela.")
        @Size(max = 50, message = "Envie no máximo 50 tabelas por arquivo.")
        List<@NotNull(message = "Envie os dados de cada tabela.") @Valid TabelaManual> tabelas

) {}
