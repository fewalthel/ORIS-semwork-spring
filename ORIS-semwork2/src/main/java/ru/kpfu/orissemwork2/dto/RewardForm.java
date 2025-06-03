package ru.kpfu.orissemwork2.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.kpfu.orissemwork2.models.RewardType;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RewardForm {
    String name;
    String description;
    RewardType type;
    Integer threshold;
}
