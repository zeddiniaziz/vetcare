package com.example.demo.controller;

import com.example.demo.model.Animal;
import com.example.demo.service.AnimalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/animals")
public class AnimalController {

    private final AnimalService service;

    public AnimalController(AnimalService service) {
        this.service = service;
    }

    @GetMapping
    public List<Animal> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Animal get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    public Animal create(@RequestBody Animal a) {
        return service.create(a);
    }

    @PutMapping("/{id}")
    public Animal update(@PathVariable Long id, @RequestBody Animal newData) {
        return service.update(id, newData);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/species/{species}")
    public List<Animal> searchBySpecies(@PathVariable String species) {
        return service.getBySpecies(species);
    }
    
    @GetMapping("/search")
    public List<Animal> searchAnimals(
            @RequestParam(required = false) String species,
            @RequestParam(required = false) Long ownerId
    ) {
        return service.search(species, ownerId);
    }

}
