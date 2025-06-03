package ru.kpfu.orissemwork2.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "rewards")
public class Reward {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rewardId;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String description;

    @OneToOne
    @JoinColumn(name = "image_id")
    private FileInfo image;

    @Column(nullable = false)
    private Integer threshold;

    @Column(nullable = false)
    private RewardType type;

    @ManyToMany(mappedBy = "rewards")
    private List<User> users = new ArrayList<>();
}