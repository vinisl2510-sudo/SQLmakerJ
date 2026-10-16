package com.sqlmaker.backend.exception;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail tratarValidacao(
            MethodArgumentNotValidException erro
    ) {
        Map<String, String> campos = new LinkedHashMap<>();

        for (FieldError campo : erro.getBindingResult().getFieldErrors()) {
            campos.putIfAbsent(
                    campo.getField(),
                    campo.getDefaultMessage()
            );
        }

        ProblemDetail problema = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Confira os campos enviados."
        );

        problema.setTitle("Dados de entrada inválidos");
        problema.setProperty("campos", campos);

        return problema;
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ProblemDetail tratarJson(
            HttpMessageNotReadableException erro
    ) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Envie um JSON válido. O banco deve ser MYSQL, POSTGRESQL ou ORACLE."
        );

        problema.setTitle("Requisição inválida");

        return problema;
    }

    @ExceptionHandler(ModeloManualInvalidoException.class)
    public ProblemDetail tratarModeloManualInvalido(
            ModeloManualInvalidoException erro
    ) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                erro.getMessage()
        );

        problema.setTitle("Estrutura das tabelas inválida");
        problema.setProperty("erros", erro.getErros());

        return problema;
    }
}