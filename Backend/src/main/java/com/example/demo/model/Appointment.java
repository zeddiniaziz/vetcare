package com.example.demo.model;

//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String date;
    private String description;
    private String veterinarianName;
    private String status;

    @ManyToOne
    @JoinColumn(name = "animal_id")
    private Animal animal;

    public Appointment() {}

    public Appointment(String date, String description, String veterinarianName, String status, Animal animal) {
        this.date = date;
        this.description = description;
        this.veterinarianName = veterinarianName;
        this.status = status;
        this.animal = animal;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getVeterinarianName() {
		return veterinarianName;
	}

	public void setVeterinarianName(String veterinarianName) {
		this.veterinarianName = veterinarianName;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Animal getAnimal() {
		return animal;
	}

	public void setAnimal(Animal animal) {
		this.animal = animal;
	}

    
}
