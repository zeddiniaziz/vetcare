package com.example.demo.repository;

import com.example.demo.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByVeterinarianName(String veterinarianName);

    List<Appointment> findByStatus(String status);

    List<Appointment> findByAnimalId(Long animalId);
    
    List<Appointment> findByVeterinarianNameAndStatus(String veterinarianName, String status);

}
