package com.sqlmaker.backend.exception;

public class ArquivoInvalidoException extends RuntimeException {

    public ArquivoInvalidoException(String mensagem) {
        super(mensagem);
    }
}