package com.printifyx.backend.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.printifyx.backend.entity.Address;
import com.printifyx.backend.repository.AddressRepository;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public List<Address> getAddressesByUserId(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    @Transactional
    public Address addAddress(Address address) {
        if (address.getIsDefault()) {
            // Unset other defaults for this user
            List<Address> existingDefaults = addressRepository.findByUserIdAndIsDefaultTrue(address.getUserId());
            for (Address ad : existingDefaults) {
                ad.setIsDefault(false);
                addressRepository.save(ad);
            }
        }
        return addressRepository.save(address);
    }

    @Transactional
    public void deleteAddress(Long id, Long userId) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        
        if (!address.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this address");
        }
        
        addressRepository.delete(address);
    }
}
