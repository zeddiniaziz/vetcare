package com.example.demo.controller;

import com.example.demo.model.Owner;
import com.example.demo.service.OwnerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/owners")
public class OwnerController {

    private final OwnerService service;

    public OwnerController(OwnerService service) {
        this.service = service;
    }

    @GetMapping
    public List<Owner> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Owner get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    public Owner create(@RequestBody Owner owner) {
        return service.create(owner);
    }

    @PutMapping("/{id}")
    public Owner update(@PathVariable Long id, @RequestBody Owner newOwner) {
        return service.update(id, newOwner);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    // example: /api/owners/search?query=John or qure
    @GetMapping("/search")
    public List<Owner> search(@RequestParam(required = false) String query) {
        return service.search(query);
    }
}

