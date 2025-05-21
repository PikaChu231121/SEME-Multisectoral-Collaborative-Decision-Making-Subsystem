package com.example.SmartCommunity.repository;


import com.example.SmartCommunity.model.EventAction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventActionRepository extends JpaRepository<EventAction, Long> {
    List<EventAction> findByStageId(Long id);
}
