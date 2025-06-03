import {Reward} from "@types/models";
import {RewardCard} from "@pages/Admin/RewardCard";
import {FC} from "react";

interface Props {
    rewardsList: Reward[];
}

export const RewardsList: FC<Props> = ({rewardsList}) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            margin: '1vw',
        }}>
            {rewardsList.map((reward: Reward) => (
                <RewardCard key={reward.id} reward={reward}/>
            ))}
        </div>
    );
};
