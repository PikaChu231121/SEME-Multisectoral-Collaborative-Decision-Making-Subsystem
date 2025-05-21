package com.example.SmartCommunity.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;


@Entity
@Table(name = "event_action")
@Getter
@Setter
public class EventAction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "department_name")
    private String departmentName;

    @Column(name = "action_name")
    private String actionName;

    @Column(name = "action_detail", columnDefinition = "TEXT")
    private String actionDetail;

    @ManyToOne
    @JoinColumn(name = "stage_id")
    private EventStage stage;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
