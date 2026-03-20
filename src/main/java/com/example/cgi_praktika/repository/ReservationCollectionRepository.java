package com.example.cgi_praktika.repository;

import com.example.cgi_praktika.model.Reservation;
import jakarta.annotation.PostConstruct;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class ReservationCollectionRepository {

    private final JdbcTemplate jdbcTemplate;

    public ReservationCollectionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static Reservation mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new Reservation(rs.getInt("reservationId"),
                rs.getInt("tableId"),
                rs.getTimestamp("reservationFrom").toLocalDateTime(),
                rs.getTimestamp("reservationUntil").toLocalDateTime()
        );
    }

    public List<Reservation> getAll() {
        String sql = "SELECT * FROM reservations";
        return jdbcTemplate.query(sql, ReservationCollectionRepository::mapRow);
    }

    public void createReservation(Reservation reservation) {
        String sql = "INSERT INTO reservations (reservationId, tableId, reservationFrom, reservationUntil) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, reservation.reservationId(), reservation.tableId(), reservation.reservationFrom(), reservation.reservationUntil());
    }

    public void saveReservation(Reservation reservation) {
        String sql = "UPDATE reservations SET tableId=?, reservationFrom=?, reservationUntil=? WHERE reservationId=?";
        jdbcTemplate.update(sql, reservation.tableId(), reservation.reservationFrom(), reservation.reservationUntil(), reservation.tableId());
    }

    public void deleteReservationById(int id) {
        String sql = "DELETE FROM reservations WHERE reservationId=?";
        jdbcTemplate.update(sql, id);
    }

    @SuppressWarnings("deprecation")
    public Optional<Reservation> getReservationById(int id) {
        String sql = "SELECT * FROM reservations WHERE reservationId=?";
        try {
            Reservation reservation = jdbcTemplate.queryForObject(sql, new Object[]{id}, ReservationCollectionRepository::mapRow);
            return Optional.ofNullable(reservation);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }


    @PostConstruct
    public void init() {
        Reservation r = new Reservation(
                1,
                1,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        if (getReservationById(r.reservationId()).isEmpty()) {
            createReservation(r);
        }
    }
}
