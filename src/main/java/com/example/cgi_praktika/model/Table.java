package com.example.cgi_praktika.model;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record Table(
        @NotNull
        Integer tableId,
        @NotNull
        Integer tableCapacity,
        // outside/inside/private
        @NotEmpty
        String tableZone,
        // quiet/by window/etc
        String tablePreferences,
        @NotNull
        Integer startingPosX,
        @NotNull
        Integer startingPosY,
        @NotNull
        Integer tableWidth
) {
}

