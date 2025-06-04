import {useAppContext} from "../../AppContext";
import {NotFoundPage} from "@pages/Errors/NotFoundPage";
import {AdminMenuHeader} from "@pages/Admin/AdminMenuHeader";

export const AdminMenuPage = () => {

    const {user} = useAppContext();

    return (user.role != 'USER' ?
            <>
                <div id="container-for-content">
                    <AdminMenuHeader/>
                </div>
                <h1>This is admin menu</h1>
            </>
            : <NotFoundPage/>
    )
}