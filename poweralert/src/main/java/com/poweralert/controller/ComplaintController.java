package com.poweralert.controller;

import com.poweralert.model.Complaint;
import com.poweralert.service.ComplaintService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }


    // Add Complaint
    @PostMapping("/add")
    public Complaint addComplaint(@RequestBody Complaint complaint) {
        return complaintService.addComplaint(complaint);
    }


    // Get All Complaints
    @GetMapping("/all")
    public List<Complaint> getAllComplaints() {
        return complaintService.getAllComplaints();
    }


    // Update Status
    @PutMapping("/status/{id}")
    public Complaint updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return complaintService.updateStatus(id, status);
    }


    // Delete Complaint
    @DeleteMapping("/delete/{id}")
    public String deleteComplaint(@PathVariable Long id) {

        complaintService.deleteComplaint(id);

        return "Complaint Deleted Successfully";
    }
}