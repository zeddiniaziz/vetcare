package com.example.demo.repository;

import com.example.demo.model.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnimalRepository extends JpaRepository<Animal, Long> {

    List<Animal> findBySpecies(String species);

    List<Animal> findByOwnerId(Long ownerId);
    
    List<Animal> findBySpeciesAndOwnerId(String species, Long ownerId);

}
