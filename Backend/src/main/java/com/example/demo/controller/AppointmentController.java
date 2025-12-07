package com.example.demo.controller;

import com.example.demo.model.Appointment;
import com.example.demo.service.AppointmentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Appointment> all() {
        return service.getAll();
    }

    @PostMapping
    public Appointment create(@RequestBody Appointment a) {
        return service.create(a);
    }

    @GetMapping("/{id}")
    public Appointment get(@PathVariable Long id) {
        return service.get(id);
    }

    @PutMapping("/{id}")
    public Appointment update(@PathVariable Long id, @RequestBody Appointment newApp) {
        return service.update(id, newApp);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // /appointments/search?veterinarian=&status=
    @GetMapping("/search")
    public List<Appointment> searchAppointments(
            @RequestParam(required = false) String veterinarian,
            @RequestParam(required = false) String status
    ) {
        return service.search(veterinarian, status);
    }
}
