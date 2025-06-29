import {useState} from "react";
import {useAppContext} from "../../AppContext";
import axiosConfig from "../../axiosConfig";
import Cookies from "js-cookie";
import {useForm} from "react-hook-form";
import {handleImageChange, logout} from "@api/usersApi";


export const SettingsPage = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const {setUser, user} = useAppContext();

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        reset: resetPasswordForm,
    } = useForm();

    const {
        register: registerUsername,
        handleSubmit: handleUsernameSubmit,
        reset: resetUsernameForm,
    } = useForm();

    const {
        handleSubmit: handleDeleteSubmit,
    } = useForm();

    const {
        handleSubmit: handleUploadSubmit,
    } = useForm();

    const onChangePassword = async (data: any) => {
        const {oldPassword, newPassword} = data;

        try {
            const response = await axiosConfig.post('/settings/changePassword', {
                oldPassword,
                newPassword,
            });

            Cookies.set('jwtToken', response.body);
        } catch (error: any) {
            alert('Error change password');
        }
    };

    const onChangeUsername = async (data: any) => {
        const {newUsername} = data;

        try {
            const response = await axiosConfig.post('/settings/changeUsername', {newUsername});
            localStorage.setItem('jwtToken', response.data);
            const newUser = {...user}
            newUser.username = newUsername
            setUser(newUser)
            resetUsernameForm();
        } catch (error) {
            alert(`Error change username: ${error}`);
        }
    };

    const onDeleteAccount = async () => {
        try {
            await axiosConfig.post('/settings/deleteAccount');
            await logout()
        } catch (error) {
            alert(error.message || error);
        }
    };

    const onUploadAvatar = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axiosConfig.post('/files/save/avatar', formData);
            alert(`Файл успешно загружен: ${response.data}`);
            setFile(null);
            setPreview(null);
        } catch (error) {
            console.log(error)
            alert(`Error upload file: ${error.response.data}`);
        }
    };

    return (
        <div id="container-for-content">
            <section className="form-to-settings">
                <h2>Settings</h2>
                <h4>Here you can change your username or password</h4>

                <form onSubmit={handlePasswordSubmit(onChangePassword)}>
                    <div className="form-group"><br/>
                        <label>Change password</label>
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder="old password"
                            {...registerPassword('oldPassword', {required: true})}
                        />
                        <br/>
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder="new password"
                            {...registerPassword('newPassword', {required: true})}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            <span>{isPasswordVisible ? 'Hide password' : 'Show password'}</span>
                        </button>
                    </div>
                    <button className="button" type="submit">Change password</button>
                </form>

                <br/>

                <form onSubmit={handleUsernameSubmit(onChangeUsername)}>
                    <div className="form-group"><br/>
                        <label>Change username</label>
                        <input
                            type="text"
                            placeholder="new username"
                            {...registerUsername('newUsername', {required: true})}
                        />
                    </div>
                    <br/>
                    <button type="submit" className="button">Change username</button>
                </form>
            </section>

            <section className="form-to-settings">
                <h4>Here you can delete your account if you want</h4>
                <form onSubmit={handleDeleteSubmit(onDeleteAccount)}>
                    <button type="submit" className="button">Confirm and delete</button>
                </form>
            </section>

            <section className="form-to-settings">
                <h4>Here you can add or update avatar to your account</h4>
                <form className="upload-form" onSubmit={handleUploadSubmit(onUploadAvatar)}>
                    <div className="form-group">
                        <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={(e) => handleImageChange(e, setFile, setPreview)}
                        />
                    </div>
                    {preview && (
                        <div className="preview-container">
                            <img src={preview} alt="Preview" className="image-preview"/>
                        </div>
                    )}
                    <button type="submit" className="upload-button">Upload avatar</button>
                </form>
            </section>
        </div>
    );
};
// export const SettingsPage = () => {
//     const [preview, setPreview] = useState<string | null>(null);
//     const [file, setFile] = useState<File | null>(null);
//     const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//     const {setUser} = useAppContext();
//     const navigate = useNavigate();
//
//     const oldPasswordRef = useRef<HTMLInputElement>(null);
//     const newPasswordRef = useRef<HTMLInputElement>(null);
//     const newUsernameRef = useRef<HTMLInputElement>(null);
//
//     const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const selectedFile = event.target.files?.[0];
//         if (!selectedFile) return;
//
//         setFile(selectedFile);
//
//         const reader = new FileReader();
//         reader.onloadend = () => setPreview(reader.result as string);
//         reader.readAsDataURL(selectedFile);
//     };
//
//     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         if (!file) return;
//
//         const formData = new FormData();
//         formData.append('file', file);
//
//         try {
//             const response = await axiosConfig.post('/files/save/avatar', formData);
//             console.log('Upload success:', response.data);
//             alert(`Файл успешно загружен: ${response.data}`);
//             setFile(null);
//             setPreview(null);
//         } catch (error: any) {
//             console.error('Upload error:', error);
//             alert('Ошибка при загрузке файла');
//         }
//     };
//
//     const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//
//         const oldPassword = oldPasswordRef.current?.value;
//         const newPassword = newPasswordRef.current?.value;
//
//         if (!oldPassword || !newPassword) {
//             alert('Пожалуйста, заполните оба поля паролей');
//             return;
//         }
//
//         try {
//             const response = await axiosConfig.post('/settings/changePassword', {
//                 oldPassword,
//                 newPassword,
//             });
//
//             Cookies.set('jwtToken', response.body);
//
//             if (response.status === 200) {
//                 alert('Пароль успешно изменён!');
//             } else {
//                 alert('Не удалось изменить пароль');
//             }
//         } catch (error: any) {
//             console.error(error.message || error);
//             alert('Ошибка при отправке запроса');
//         }
//     };
//
//     const logout = async () => {
//         try {
//             document.cookie.split(';').forEach(cookie => {
//                 const [name] = cookie.split('=');
//                 document.cookie = `${name.trim()}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
//             });
//             setUser(null);
//             sessionStorage.removeItem('user');
//             navigate('/');
//         } catch (err: any) {
//             console.error('Logout error:', err.message || err);
//         }
//     };
//
//     const handleDeleteAccount = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//
//         try {
//             const response = await axiosConfig.post('/settings/deleteAccount');
//             if (response.status === 200) {
//                 logout();
//             }
//         } catch (error: any) {
//             console.error(error.message || error);
//         }
//     };
//
//     const handleChangeUsername = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//
//         const newUsername = newUsernameRef.current?.value;
//
//         if (!newUsername) {
//             alert('Пожалуйста, заполните поле перед отправкой');
//             return;
//         }
//
//         try {
//             const response = await axiosConfig.post('/settings/changeUsername', {
//                 newUsername,
//             });
//
//             if (response.status === 200) {
//                 setUser((prev: User) => ({
//                     ...prev,
//                     username: newUsername,
//                 }));
//                 alert('Имя пользователя изменено');
//             } else {
//                 alert('Не удалось изменить имя пользователя');
//             }
//         } catch (error: any) {
//             console.error(error.message || error);
//             alert('Ошибка при отправке запроса');
//         }
//     };
//
//     return (
//         <div id="container-for-content">
//             <section className="form-to-settings">
//                 <h2>Settings</h2>
//                 <h4>Here you can change your username or password</h4>
//
//                 <form onSubmit={handleChangePassword}>
//                     <div className="form-group"><br/>
//                         <label>Change password</label>
//                         <input
//                             type={isPasswordVisible ? 'text' : 'password'}
//                             placeholder="old password"
//                             ref={oldPasswordRef}
//                         />
//                         <br/>
//                         <input
//                             type={isPasswordVisible ? 'text' : 'password'}
//                             placeholder="new password"
//                             ref={newPasswordRef}
//                         />
//                         <button
//                             type="button"
//                             className="toggle-password"
//                             onClick={() => setIsPasswordVisible(!isPasswordVisible)}
//                         >
//                             <span>{isPasswordVisible ? 'Hide password' : 'Show password'}</span>
//                         </button>
//                     </div>
//                     <button className="button" type="submit">Change password</button>
//                 </form>
//
//                 <br/>
//
//                 <form onSubmit={handleChangeUsername}>
//                     <div className="form-group"><br/>
//                         <label>Change username</label>
//                         <input
//                             type="text"
//                             placeholder="new username"
//                             ref={newUsernameRef}
//                         />
//                     </div>
//                     <br/>
//                     <button type="submit" className="button">Change username</button>
//                 </form>
//             </section>
//
//             <section className="form-to-settings">
//                 <h4>Here you can delete your account if you want</h4>
//                 <form onSubmit={handleDeleteAccount}>
//                     <button type="submit" className="button">Confirm and delete</button>
//                 </form>
//             </section>
//
//             <section className="form-to-settings">
//                 <h4>Here you can add or update avatar to your account</h4>
//                 <form className="upload-form" onSubmit={handleSubmit}>
//                     <div className="form-group">
//                         <input
//                             type="file"
//                             accept="image/*"
//                             required
//                             onChange={handleImageChange}
//                         />
//                     </div>
//                     {preview && (
//                         <div className="preview-container">
//                             <img src={preview} alt="Preview" className="image-preview"/>
//                         </div>
//                     )}
//                     <button type="submit" className="upload-button">Upload avatar</button>
//                 </form>
//             </section>
//         </div>
//     );
// };