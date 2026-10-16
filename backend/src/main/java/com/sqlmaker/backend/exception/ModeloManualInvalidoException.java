package com.sqlmaker.backend.exception;

import java.util.List;

/** Reúne todos os problemas da estrutura enviada no modo manual. */
public class ModeloManualInvalidoException extends RuntimeException {

    private final List<String> erros;

    public ModeloManualInvalidoException(List<String> erros) {
        super(erros.size() == 1
                ? erros.get(0)
                : "A estrutura tem " + erros.size() + " problemas.");
        this.erros = List.copyOf(erros);
    }

    public List<String> getErros() {
        return erros;
    }
}
