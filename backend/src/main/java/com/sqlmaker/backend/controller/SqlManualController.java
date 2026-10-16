package com.sqlmaker.backend.controller;

import com.sqlmaker.backend.dto.GeracaoManualRequest;
import com.sqlmaker.backend.dto.GeracaoManualResponse;
import com.sqlmaker.backend.service.GeracaoManualService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/manual")
public class SqlManualController {

    private final GeracaoManualService geracaoManualService;

    public SqlManualController(GeracaoManualService geracaoManualService) {
        this.geracaoManualService = geracaoManualService;
    }

    @PostMapping(
            value = "/gerar",
            produces = "application/json;charset=UTF-8"
    )
    public GeracaoManualResponse gerar(
            @Valid @RequestBody GeracaoManualRequest requisicao
    ) {
        return geracaoManualService.gerar(requisicao);
    }
}
