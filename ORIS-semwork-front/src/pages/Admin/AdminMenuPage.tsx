import {useAppContext} from "../../AppContext";
import {NotFoundPage} from "@pages/Errors/NotFoundPage";

export const AdminMenuPage = () => {

    const {user} = useAppContext();

    return ( user.role != 'USER' ?
                <h1>This is admin menu</h1>
            : <NotFoundPage/>
    )
}