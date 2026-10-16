package com.sqlmaker.backend.dto;

import com.sqlmaker.backend.model.BancoDestino;

import java.util.List;

public record GeracaoManualResponse(
        BancoDestino banco,
        String versao,
        List<ArquivoSql> arquivos,
        String explicacao) {
}
