package com.example.cgi_praktika.model;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record Reservation(
        @NotNull
        Integer reservationId,
        @NotNull
        Integer tableId,
        @FutureOrPresent
        LocalDateTime reservationFrom,
        @FutureOrPresent
        LocalDateTime reservationUntil
        ) {
}
