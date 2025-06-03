import {MainPage} from '@pages/Main/MainPage';
import {AllUsersPage} from "@pages/Admin/AllUsersPage";
import {AllQuestionsPage} from "@pages/Profile/AllQuestionsPage";
import {AllCategoriesPage} from "@pages/Admin/AllCategoriesPage";
import {ProfilePage} from "@pages/Profile/ProfilePage";
import {AdminMenuPage} from "@pages/Admin/AdminMenuPage";
import {MyQuestionsPage} from "@pages/Profile/MyQuestionsPage";
import {FavoritesAnswersPage} from "@pages/Profile/FavoritesAnswersPage";
import {SignInPage} from "@pages/SignIn/SignInPage"
import {SignUpPage} from "@pages/SignUp/SignUpPage";
import {SettingsPage} from "@pages/Profile/SettingsPage";
import {QuestionPage} from '@pages/Profile/QuestionPage';
import {ProfileHeader} from "@pages/Profile/ProfileHeader";
import {Route, Routes, useLocation} from "react-router-dom";
import {ConfirmPage} from "@pages/Confirm/ConfirmPage";
import {AllRewardsPage} from "@pages/Admin/AllRewardsPage";
import {AdminMenuHeader} from "@pages/Admin/AdminMenuHeader";
import {RatingPage} from "@pages/Profile/RatingPage";

function AppContent() {
    const location = useLocation();

    const showHeaderPaths = [
        '/profile',
        '/all_users',
        '/all_categories',
        '/all_questions',
        '/all_rewards',
        '/question',
        '/settings',
        '/favorites_answers',
        '/my_questions',
        '/admin_menu',
        '/rating'
    ];

    const showAdminHeaderPaths = [
        '/admin_menu',
        '/all_users',
        '/all_categories',
        '/all_rewards'
    ];

    const showProfileHeader = showHeaderPaths.some(path => location.pathname.startsWith(path));
    const showAdminHeader = showAdminHeaderPaths.some(path => location.pathname.startsWith(path));

    return (
        <>
            {showProfileHeader && <ProfileHeader/>}

            {showAdminHeader && <div id="container-for-content"><AdminMenuHeader/></div>}

            <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/signIn" element={<SignInPage/>}/>
                <Route path="/signUp" element={<SignUpPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/all_questions" element={<AllQuestionsPage/>}/>
                <Route path="/favorites_answers" element={<FavoritesAnswersPage/>}/>
                <Route path="/my_questions" element={<MyQuestionsPage/>}/>
                <Route path="/settings" element={<SettingsPage/>}/>
                <Route path="/question" element={<QuestionPage/>}/>
                <Route path="/confirm" element={<ConfirmPage/>}/>
                <Route path="/all_users" element={<AllUsersPage/>}/>
                <Route path="/all_categories" element={<AllCategoriesPage/>}/>
                <Route path="/admin_menu" element={<AdminMenuPage/>}/>
                <Route path="/all_rewards" element={<AllRewardsPage/>}/>
                <Route path="/rating" element={<RatingPage/>}/>
            </Routes>


        </>
    );
}

export default AppContent;