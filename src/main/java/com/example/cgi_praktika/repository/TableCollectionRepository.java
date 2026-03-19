package com.example.cgi_praktika.repository;

import com.example.cgi_praktika.model.Table;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class TableCollectionRepository {
    private final List<Table> tableList = new ArrayList<>();

    public TableCollectionRepository() {}

    public List<Table> findAllTables() {
        return tableList;
    }

    public Optional<Table> findTableById(Integer id) {
        return tableList.stream().filter(c -> c.tableId().equals(id)).findFirst();
    }

    public void createTable(Table table) {
        tableList.add(table);
    }

    public void saveTable(Table table) {
        // Removes old table data (PUT request)
        tableList.removeIf(c -> c.tableId().equals(table.tableId()));
        tableList.add(table);
    }

    public void deleteTableById(int id) {
        tableList.removeIf(c -> c.tableId().equals(id));
    }

    @PostConstruct
    public void init() {
        Table c = new Table(
                1,
                1,
                true,
                LocalDateTime.now());
        tableList.add(c);
    }
}
