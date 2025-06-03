package ru.kpfu.orissemwork2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import ru.kpfu.orissemwork2.models.FileInfo;

import java.util.Optional;

public interface FilesInfoRepository extends JpaRepository<FileInfo, Long> {
    Optional<FileInfo> findByStorageFileName(String storageFileName);

    Optional<FileInfo> findById(Long id);

    @Transactional
    @Query("SELECT u.avatar FROM User u WHERE u.accountId = :userId")
    Optional<FileInfo> findByUserAccountId(@Param("userId") Long userId);

    @Transactional
    @Query("SELECT r.image FROM Reward r WHERE r.rewardId= :rewardId")
    Optional<FileInfo> findByRewardId(@Param("rewardId") Long rewardId);
}