package com.example.demo.service;

import com.example.demo.model.Owner;
import com.example.demo.repository.OwnerRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OwnerService {

    private final OwnerRepository repo;

    public OwnerService(OwnerRepository repo) {
        this.repo = repo;
    }

    public Owner create(Owner owner) {
        return repo.save(owner);
    }

    public List<Owner> getAll() {
        return repo.findAll();
    }

    public Owner get(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Owner update(Long id, Owner newOwner) {
        Owner owner = get(id);
        if (owner == null) return null;

        owner.setFirstName(newOwner.getFirstName());
        owner.setLastName(newOwner.getLastName());
        owner.setEmail(newOwner.getEmail());
        owner.setPhone(newOwner.getPhone());
        owner.setAddress(newOwner.getAddress());
        
        return repo.save(owner);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public List<Owner> search(String query) {
        if (query == null || query.trim().isEmpty()) {
            return repo.findAll();
        }
        return repo.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            query, query, query);
    }
}

