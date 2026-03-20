package com.example.cgi_praktika.model;

import java.time.LocalDateTime;

public record Reservation(
        Integer reservationId,
        Integer tableId,
        LocalDateTime reservationFrom,
        LocalDateTime reservationUntil
        ) {
}
