import type { FC } from "react";
import type {Category} from '@types/models';

interface Props {
    category: Category;
}

const CategoryRow: FC<Props> = ({category}: Props) => {
    return (<tr>
        <td>{category.id}</td>
        <td>{category.name}</td>
    </tr>)
}

export default CategoryRow;