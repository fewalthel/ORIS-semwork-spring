package ru.kpfu.orissemwork2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import ru.kpfu.orissemwork2.models.User;

import java.util.List;
import java.util.Optional;

public interface UsersRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findById(Long id);

    Optional<User> findByConfirmCode(String confirmCode);

    List<User> findAll();

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.avatar.id = :avatarId WHERE u.accountId = :userId")
    void saveAvatarId(@Param("userId") Long userId, @Param("avatarId") Long avatarId);

    @Query("SELECT u FROM User u LEFT JOIN u.rewards r GROUP BY u ORDER BY COUNT(r) DESC")
    List<User> findAllOrderByRewardsDesc();
}