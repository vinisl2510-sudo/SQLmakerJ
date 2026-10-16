package com.sqlmaker.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record DownloadZipRequest(

        @NotEmpty(message = "Envie pelo menos um arquivo.")
        List<@NotNull @Valid ArquivoSql> arquivos

) {}