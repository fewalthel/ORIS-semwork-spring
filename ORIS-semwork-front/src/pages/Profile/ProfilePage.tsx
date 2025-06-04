import {useEffect, useState} from "react";
import {Skeleton} from "antd";
import {useAppContext} from "../../AppContext";
import {NotFoundPage} from "@pages/Errors/NotFoundPage";
import {RewardsList} from "@components/RewardsList";
import {fetchUserRewards} from "@api/rewardsApi";
import {Reward} from "@types/models";
import {fetchAvatar} from "@api/usersApi";

export const ProfilePage = () => {
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [rewardsList, setRewardsList] = useState<Reward[]>([]);

    const {user} = useAppContext();

    useEffect(() => {
        Promise.allSettled([
            fetchUserRewards(setRewardsList, user.id),
            fetchAvatar(setAvatarUrl)
        ])
    }, [])

    if (!user) {
        return <NotFoundPage/>;
    }

    return (
        <div id="container-for-content">
            <section id="about-user" className="statistics-card">
                {avatarUrl ? (
                    <div id="avatar">
                        <img src={avatarUrl} alt="avatar"/>
                    </div>
                ) : (
                    <Skeleton.Image
                        style={{
                            width: '15vw',
                            height: '15vw',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            boxShadow: '0 0 25px #7dffd3',
                            marginTop: '1vw',
                            marginLeft: '2vw',
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    />
                )}

                <div className="container-for-username-email">
                    <h2>My username: {user.username}</h2>
                    <h2>My email: {user.email}</h2>
                    <h3>My role: {user.role}</h3>
                </div>
            </section>

            <section className="statistics-card">
                <h2>My rewards</h2>
                {rewardsList.length > 0 ? (
                    <RewardsList rewardsList={rewardsList}/>
                ) : (
                    <p>There are no awards here yet</p>
                )}
            </section>
        </div>
    );
};