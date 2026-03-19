package com.example.cgi_praktika.model;

import java.time.LocalDateTime;

public record Table(
        Integer tableId,
        Integer tableSize,
        boolean isReserved,
        LocalDateTime occupiedUntil
) {
}

