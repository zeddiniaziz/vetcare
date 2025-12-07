package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class ViewController {

    @GetMapping("/")
    public String index() {
        return "forward:/index.html";
    }

    @GetMapping("/animals")
    public String animals() {
        return "forward:/animals.html";
    }

    @GetMapping("/animals/{id}")
    public String animalDetail(@PathVariable Long id) {
        return "forward:/animal-detail.html";
    }

    @GetMapping("/appointments")
    public String appointments() {
        return "forward:/appointments.html";
    }

    @GetMapping("/appointments/{id}")
    public String appointmentDetail(@PathVariable Long id) {
        return "forward:/appointment-detail.html";
    }
}

