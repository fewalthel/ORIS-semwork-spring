package ru.kpfu.orissemwork2.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "answers")
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long answerId;

    @Column(nullable = false)
    private String content;

    @Column(name = "published_at")
    private Instant publishedAt;

    private Boolean isEdited = false;

    @ManyToOne
    @JoinColumn(name = "questionId", nullable = false)
    private Question question;

    @ManyToOne
    @JoinColumn(name = "accountId", nullable = false)
    private User user;

    @ManyToMany(mappedBy = "favoritesAnswers")
    private List<User> users = new ArrayList<>();

    @PreRemove
    private void removeAnswerFromUsers() {
        for (User user : users) {
            user.getFavoritesAnswers()
                    .remove(this);
        }
    }
}