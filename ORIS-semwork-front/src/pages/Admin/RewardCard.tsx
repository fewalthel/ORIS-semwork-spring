import {Reward} from "@types/models";
import {FC, useEffect, useState} from "react";
import {fetchImage} from "@api/rewardsApi";
import {useAppContext} from "../../AppContext";

interface Props {
    reward: Reward
}

export const RewardCard: FC<Props> = ({reward}: Props) => {
    const {user} = useAppContext()
    const [imageUrl, setImageUrl] = useState<string>('');

    useEffect(() => {
        fetchImage(reward.id, setImageUrl);
    }, []);

    return (
        <div className="reward-container">
            <img src={imageUrl}/>
            <strong>{reward.name}</strong>
            <p>{reward.description}</p>
            {user.role === 'ADMIN' && <p>id: {reward.id}</p>}
        </div>
    )
}