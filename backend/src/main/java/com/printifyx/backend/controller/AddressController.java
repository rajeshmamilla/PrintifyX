package com.printifyx.backend.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.printifyx.backend.config.UserPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.printifyx.backend.entity.Address;
import com.printifyx.backend.service.AddressService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public ResponseEntity<List<Address>> getMyAddresses(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(addressService.getAddressesByUserId(principal.getUserId()));
    }

    @PostMapping
    public ResponseEntity<Address> addAddress(@AuthenticationPrincipal UserPrincipal principal, @RequestBody Address address) {
        address.setUserId(principal.getUserId());
        return ResponseEntity.ok(addressService.addAddress(address));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        addressService.deleteAddress(id, principal.getUserId());
        return ResponseEntity.noContent().build();
    }


}
