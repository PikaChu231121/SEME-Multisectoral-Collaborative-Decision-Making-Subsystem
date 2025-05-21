package com.example.SmartCommunity.repository;


import com.example.SmartCommunity.model.EventStage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventStageRepository extends JpaRepository<EventStage, Long> {
    List<EventStage> findByEventIdOrderByIdAsc(Long eventId);
}
