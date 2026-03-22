package com.example.cgi_praktika.repository;

import com.example.cgi_praktika.model.Table;
import jakarta.annotation.PostConstruct;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class TableCollectionRepository {

    private final JdbcTemplate jdbcTemplate;

    public TableCollectionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static Table mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new Table(rs.getInt("tableId"),
                rs.getInt("tableCapacity"),
                rs.getString("tablePreferences"),
                rs.getString("tablePreferences"),
                rs.getInt("startingPosX"),
                rs.getInt("startingPosY"),
                rs.getInt("tableWidth"),
                rs.getInt("tableLength")
        );
    }

    public List<Table> getAll() {
        String sql = "SELECT * FROM restaurant_tables";
        return jdbcTemplate.query(sql, TableCollectionRepository::mapRow);
    }

    // RESTAURANT tables
    public void createTable(Table table) {
        if (getTableById(table.tableId()).isEmpty()) {
            String sql = "INSERT INTO restaurant_tables (tableId, tableCapacity, tableZone, tablePreferences, startingPosX, startingPosY, tableWidth, tableLength) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql, table.tableId(), table.tableCapacity(), table.tableZone(), table.tablePreferences(), table.startingPosX(), table.startingPosY(), table.tableWidth(), table.tableLength());
        }
        }

    public void saveTable(Table table) {
        String sql = "UPDATE restaurant_tables SET tableCapacity=?, tableZone=?, tablePreferences=?, startingPosX=?, startingPosY=?, tableWidth=?, tableLength=? WHERE tableId=?";
        jdbcTemplate.update(sql, table.tableCapacity(), table.tableZone(), table.tablePreferences(), table.startingPosX(), table.startingPosY(), table.tableWidth(), table.tableLength(), table.tableId());
    }

    public void deleteTableById(int id) {
        String sql = "DELETE FROM restaurant_tables WHERE tableId=?";
        jdbcTemplate.update(sql, id);
    }

    @SuppressWarnings("deprecation")
    public Optional<Table> getTableById(int id) {
        String sql = "SELECT * FROM restaurant_tables WHERE tableId=?";
        try {
        Table table = jdbcTemplate.queryForObject(sql, new Object[]{id}, TableCollectionRepository::mapRow);
        return Optional.ofNullable(table);
    } catch (EmptyResultDataAccessException ex) {
            return Optional.empty();
        }
    }

    @PostConstruct
    public void init() {
        Table c = new Table(
                5,
                1,
                "inside",
                "window",
                5,
                5,
                1,
                1
        );

        if (getTableById(c.tableId()).isEmpty()) {
            createTable(c);
        }

    }
}
