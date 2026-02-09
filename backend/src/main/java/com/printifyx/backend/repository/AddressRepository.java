package com.printifyx.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.printifyx.backend.entity.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserId(Long userId);
    List<Address> findByUserIdAndIsDefaultTrue(Long userId);
}
