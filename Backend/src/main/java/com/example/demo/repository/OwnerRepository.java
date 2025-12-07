package com.example.demo.repository;

import com.example.demo.model.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OwnerRepository extends JpaRepository<Owner, Long> {

    List<Owner> findByFirstNameContainingIgnoreCase(String firstName);
    
    List<Owner> findByLastNameContainingIgnoreCase(String lastName);
    
    List<Owner> findByEmailContainingIgnoreCase(String email);
    
    List<Owner> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
        String firstName, String lastName, String email);
}

