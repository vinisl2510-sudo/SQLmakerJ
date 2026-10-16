package com.sqlmaker.backend.dto;

import com.sqlmaker.backend.model.TipoColuna;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Uma coluna montada no modo manual.
 * tamanho vale para VARCHAR e CHAR; no DECIMAL, tamanho é a precisão
 * (total de dígitos) e escala são as casas decimais.
 */
public record ColunaManual(

        @NotBlank(message = "Toda coluna precisa de um nome.")
        String nome,

        @NotNull(message = "Escolha o tipo de cada coluna.")
        TipoColuna tipo,

        Integer tamanho,

        Integer escala,

        Boolean chavePrimaria,

        Boolean autoIncremento,

        Boolean obrigatorio,

        Boolean unico,

        @Valid
        ReferenciaColuna referencia

) {

    // O Jackson 3 recusa boolean primitivo ausente no JSON; aqui, ausente vale false.
    public ColunaManual {
        chavePrimaria = Boolean.TRUE.equals(chavePrimaria);
        autoIncremento = Boolean.TRUE.equals(autoIncremento);
        obrigatorio = Boolean.TRUE.equals(obrigatorio);
        unico = Boolean.TRUE.equals(unico);
    }
}
