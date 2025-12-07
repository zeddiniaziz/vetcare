package com.example.demo.service;

import com.example.demo.model.Appointment;
import com.example.demo.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository repo;

    public AppointmentService(AppointmentRepository repo) {
        this.repo = repo;
    }

    public List<Appointment> getAll() {
        return repo.findAll();
    }

    public Appointment get(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Appointment create(Appointment a) {
        return repo.save(a);
    }

    public Appointment update(Long id, Appointment newApp) {
        Appointment a = get(id);
        if (a == null) return null;

        a.setDate(newApp.getDate());
        a.setDescription(newApp.getDescription());
        a.setVeterinarianName(newApp.getVeterinarianName());
        a.setStatus(newApp.getStatus());
        a.setAnimal(newApp.getAnimal());

        return repo.save(a);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    // Query Params
    public List<Appointment> search(String veterinarian, String status) {

        if (veterinarian != null && status != null) {
            return repo.findByVeterinarianNameAndStatus(veterinarian, status);
        } else if (veterinarian != null) {
            return repo.findByVeterinarianName(veterinarian);
        } else if (status != null) {
            return repo.findByStatus(status);
        } else {
            return repo.findAll();
        }
    }
}
