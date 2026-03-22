package com.example.cgi_praktika.controller;

import com.example.cgi_praktika.model.Table;
import com.example.cgi_praktika.repository.TableCollectionRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
public class TableController {

    private final TableCollectionRepository repository;

    public TableController(TableCollectionRepository TableCollectionRepository) {
        this.repository = TableCollectionRepository;
    }

    @GetMapping("")
    public List<Table> findAll(){
        return repository.getAll();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("")
    public void createTable(@Valid @RequestBody Table table){
        repository.createTable(table);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping("")
    public void updateTable(@Valid @RequestBody Table table){
        if (repository.getTableById(table.tableId()).isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Table not found");
        }
        repository.saveTable(table);
    }

    @DeleteMapping("/{id}")
    public void deleteTable(@PathVariable int id){
        if (repository.getTableById(id).isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Table not found");
        }
        repository.deleteTableById(id);
    }
}
