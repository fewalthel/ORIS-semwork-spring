import {useEffect, useState} from "react";
import {Skeleton} from "antd";
import {useAppContext} from "../../AppContext";
import {NotFoundPage} from "@pages/Errors/NotFoundPage";
import axiosConfig from "../../axiosConfig";
import {RewardsList} from "@components/RewardsList";

export const ProfilePage = () => {
    const [avatarUrl, setAvatarUrl] = useState<string>('');

    const [rewardsList, setRewardsList] = useState([]);
    const {user, setUser} = useAppContext();

    const fetchRewards = async () => {
        try {
            const response = await axiosConfig.get(`/rewards/all/forUser/${user.id}`);
            setRewardsList(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Ошибка при загрузке наград:', error);
        }
    };

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')));
        fetchRewards();
    }, [])

    useEffect(() => {
        axiosConfig.get('/files/get/avatar', {responseType: 'blob'})
            .then(response => {
                const url: string = URL.createObjectURL(response.data);
                setAvatarUrl(url);
            })
            .catch(error => {
                console.error('Error loading image:', error);
            });
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
                        active={true}
                        style={{width: '15vw',
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
                    <p>пока что тут нет наград</p>
                )}
            </section>
        </div>
    );
};