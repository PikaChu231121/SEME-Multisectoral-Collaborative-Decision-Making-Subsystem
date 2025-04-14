package com.example.SmartCommunity.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.jetbrains.annotations.NotNull;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Set;
import java.util.TreeSet;

@Getter
@Setter
@Entity
@Table(name = "UserMessage")
public class UserMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MessageID", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "TopicID", nullable = false)
    private ChatTopic topicID;

    @Lob
    @Column(name = "ContentText")
    private String contentText;

    @Size(max = 255)
    @Column(name = "ContentImage")
    private String contentImage;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "CreateTime")
    private Instant createTime;

    @OneToMany(mappedBy = "userMessage")
    private Set<AiMessage> aiMessages = new TreeSet<>();

    @PrePersist
    public void prePersist() {
        if (this.createTime == null) {
            this.createTime = ZonedDateTime.now(ZoneId.of("Asia/Shanghai")).toInstant();
        }
    }
}