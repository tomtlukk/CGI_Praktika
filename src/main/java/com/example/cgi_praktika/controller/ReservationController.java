package com.example.cgi_praktika.controller;

import com.example.cgi_praktika.model.Reservation;
import com.example.cgi_praktika.repository.ReservationCollectionRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")

public class ReservationController {

    private final ReservationCollectionRepository repository;

    public ReservationController(ReservationCollectionRepository repository) {
        this.repository = repository;
    }

    @GetMapping("")
    public List<Reservation> findAll(){
        return repository.getAll();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("")
    public void createReservation(@Valid @RequestBody Reservation reservation){
        repository.createReservation(reservation);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping("/{id}")
    public void updateReservation(@Valid @RequestBody Reservation reservation, @PathVariable int id){
        if (repository.getReservationById(id).isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Table not found");
        }
        repository.saveReservation(reservation);
    }

    @DeleteMapping("/{id}")
    public void deleteReservation(@PathVariable int id){
        if (repository.getReservationById(id).isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Table not found");
        }
        repository.deleteReservationById(id);
    }
}
