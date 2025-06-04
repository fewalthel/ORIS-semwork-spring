import {useEffect, useRef, useState} from "react";
import axiosConfig from "../../axiosConfig";
import {RewardsList} from "@components/RewardsList";
import {fetchAllRewards} from "@api/rewardsApi";
import {AdminMenuHeader} from "@pages/Admin/AdminMenuHeader";

export const AllRewardsPage = () => {
    const [rewardsList, setRewardsList] = useState([]);
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);

    const [error, setError] = useState();

    const nameRef = useRef(null);
    const descriptionRef = useRef(null);
    const thresholdRef = useRef(null);

    const rewardIdRef = useRef(null);

    useEffect(() => {
        (async () => fetchAllRewards(setRewardsList))()
    }, []);


    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const rewardData = {
            name: nameRef.current?.value,
            description: descriptionRef.current?.value,
            type: document.querySelector('input[name="type"]:checked').value,
            threshold: thresholdRef.current?.value as Number
        };

        try {
            await axiosConfig.post('/rewards/add', rewardData)
            alert('Награда успешно добавлена!');
            await fetchAllRewards(setRewardsList);
        } catch (error) {

            setError(error.response?.body)
            console.error('Ошибка при добавлении награды:', error);
            alert('Ошибка при загрузке награды');
        }
    };

    const handleSubmitFile = async (event) => {
        event.preventDefault();
        if (!file) return alert("Выберите изображение для награды");

        try {
            const formData = new FormData();
            formData.append('file', file);

            if (!rewardIdRef.current) {
                return alert("Выберите id награды для фото")
            }

            const response = await axiosConfig.post(`/files/save/rewardImage/${rewardIdRef.current.value}`, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            })
            await fetchAllRewards(setRewardsList);
        } catch (error) {
            console.error('Ошибка при загрузке изображения:', error.message);
            alert('Ошибка при загрузке изобаржения');
        }
    }

    return (
        <div id="container-for-content">
            <AdminMenuHeader/>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <form
                    onSubmit={handleSubmit}
                    style={{
                        margin: '40px auto',
                        padding: '20px',
                        backgroundColor: '#ffffff84',
                        borderRadius: '12px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        fontFamily: 'Arial, sans-serif',
                        width: '45%'
                    }}>
                    <div style={{marginBottom: '20px'}}>
                        <h3 style={{color: '#333', marginBottom: '20px'}}>Here you can add new reward</h3>
                        <div className="error-message">
                            {error}
                        </div>
                        <input
                            placeholder="Name"
                            ref={nameRef}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginBottom: '12px',
                                border: '1px solid #333',
                                borderRadius: '6px',
                                fontSize: '16px',
                            }}
                        />
                        <input
                            placeholder="Description"
                            ref={descriptionRef}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginBottom: '12px',
                                border: '1px solid #333',
                                borderRadius: '6px',
                                fontSize: '16px',
                            }}
                        />
                        <input
                            type="number"
                            min="0"
                            placeholder="Threshold"
                            ref={thresholdRef}
                            required={true}
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginBottom: '20px',
                                border: '1px solid #333',
                                borderRadius: '6px',
                                fontSize: '16px',
                            }}
                        />

                        <div className="radio-group">
                            <label className="radio-option">
                                <input type="radio" name="type" value="ANSWER" defaultChecked/>
                                <span>Answer</span>
                            </label>
                            <label className="radio-option">
                                <input type="radio" name="type" value="QUESTION"/>
                                <span>Question</span>
                            </label>
                        </div>

                    </div>
                    <button type="submit" className="button">Add reward</button>
                </form>

                <form onSubmit={handleSubmitFile}
                      style={{
                          margin: '40px auto',
                          padding: '20px',
                          backgroundColor: '#ffffff84',
                          borderRadius: '12px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          fontFamily: 'Arial, sans-serif',
                          width: '45%'
                      }}>
                    <div style={{marginBottom: '20px'}}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                            style={{
                                padding: '8px',
                                border: '2px dashed #333',
                                borderRadius: '6px',
                                backgroundColor: '#fff',
                                width: '100%',
                                cursor: 'pointer',
                            }}
                        />

                        <input type="number" min="0" ref={rewardIdRef}
                               placeholder="id reward which you want add image" required/>
                    </div>
                    {preview && (
                        <div style={{textAlign: 'center', marginBottom: '20px'}}>
                            <img
                                src={preview}
                                alt="Preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '200px',
                                    marginTop: '10px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                                    objectFit: 'contain',
                                }}
                            />
                        </div>
                    )}

                    <button type="submit" className="button">Add image to reward</button>
                </form>
            </div>

            <hr/>
            {
                rewardsList.length > 0 ? (
                    <RewardsList rewardsList={rewardsList}/>
                ) : (
                    <p>ALL REWARDS PAGE</p>
                )
            }

        </div>
    )
}