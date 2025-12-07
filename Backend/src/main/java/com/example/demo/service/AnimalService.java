package com.example.demo.service;

import com.example.demo.model.Animal;
import com.example.demo.model.Owner;
import com.example.demo.repository.AnimalRepository;
import com.example.demo.repository.OwnerRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AnimalService {

    private final AnimalRepository repo;
    private final OwnerRepository ownerRepo;

    public AnimalService(AnimalRepository repo, OwnerRepository ownerRepo) {
        this.repo = repo;
        this.ownerRepo = ownerRepo;
    }

    public Animal create(Animal a) {
        // Ensure owner is properly loaded if provided
        if (a.getOwner() != null && a.getOwner().getId() != null) {
            Owner owner = ownerRepo.findById(a.getOwner().getId()).orElse(null);
            a.setOwner(owner);
        }
        return repo.save(a);
    }

    public List<Animal> getAll() {
        return repo.findAll();
    }

    public Animal get(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Animal update(Long id, Animal newAnimal) {
        Animal a = get(id);
        if (a == null) return null;

        a.setName(newAnimal.getName());
        a.setSpecies(newAnimal.getSpecies());
        a.setAge(newAnimal.getAge());
        a.setGender(newAnimal.getGender());
        
        // Update owner if provided
        if (newAnimal.getOwner() != null && newAnimal.getOwner().getId() != null) {
            Owner owner = ownerRepo.findById(newAnimal.getOwner().getId()).orElse(null);
            a.setOwner(owner);
        } else if (newAnimal.getOwner() == null) {
            a.setOwner(null);
        }
        
        return repo.save(a);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public List<Animal> getBySpecies(String species) {
        return repo.findBySpecies(species);
    }
    
    public List<Animal> search(String species, Long ownerId) {
        if (species != null && ownerId != null) {
            return repo.findBySpeciesAndOwnerId(species, ownerId);
        } else if (species != null) {
            return repo.findBySpecies(species);
        } else if (ownerId != null) {
            return repo.findByOwnerId(ownerId);
        } else {
            return repo.findAll();
        }
    }

}
