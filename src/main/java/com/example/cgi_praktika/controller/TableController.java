package com.example.cgi_praktika.controller;

import com.example.cgi_praktika.model.Table;
import com.example.cgi_praktika.repository.TableCollectionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
public class TableController {

    private final TableCollectionRepository repository;

    public TableController(TableCollectionRepository contentCollectionRepository) {
        this.repository = contentCollectionRepository;
    }

    @GetMapping("")
    public List<Table> findAll(){
        return repository.findAllTables();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("")
    public void createTable(@RequestBody Table table){
        repository.createTable(table);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping("/{id}")
    public void updateTable(@RequestBody Table table, @PathVariable int id){
        if (repository.findTableById(id).isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Table not found");
        }
        repository.saveTable(table);
    }

    @DeleteMapping("/{id}")
    public void deleteTable(@PathVariable int id){
        if (repository.findTableById(id).isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Table not found");
        }
        repository.deleteTableById(id);
    }
}
