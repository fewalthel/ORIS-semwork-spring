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
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column
    private String confirmCode;

    @Column(nullable = false)
    private Boolean isConfirmed;

    @Column(nullable = false)
    private Role role;

    @ManyToMany
    @JoinTable(name = "favoritesAnswers", joinColumns = @JoinColumn(name = "accountId", referencedColumnName = "accountId"), inverseJoinColumns = @JoinColumn(name = "answerId", referencedColumnName = "answerId"))
    private List<Answer> favoritesAnswers = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "users_rewards", joinColumns = @JoinColumn(name = "accountId", referencedColumnName = "accountId"), inverseJoinColumns = @JoinColumn(name = "rewardId", referencedColumnName = "rewardId"))
    private List<Reward> rewards = new ArrayList<>();


    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "avatar_id")
    private FileInfo avatar;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "user")
    private List<Answer> answers = new ArrayList<>();


    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "user")
    private List<Question> questions = new ArrayList<>();
}