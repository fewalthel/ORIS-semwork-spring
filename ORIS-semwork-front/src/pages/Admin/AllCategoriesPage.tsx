import type {Category} from "@types/models";
import {lazy, useEffect, useRef, useState} from "react";
import {addNewCategory, fetchCategories} from "@api/categoriesApi";
import {Spin} from "antd";
import {AdminMenuHeader} from "@pages/Admin/AdminMenuHeader";

const CategoryRow = lazy(() => import("@pages/Admin/CategoryRow"));

export const AllCategoriesPage = () => {
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    const nameRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        (async () => fetchCategories(setCategoriesList))()
    }, []);

    return (
        <div id="container-for-content">

                <AdminMenuHeader/>

            <Spin spinning={categoriesList.length === 0}>
                <table id="table">
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categoriesList.map(category => (
                        <CategoryRow key={category.id} category={category}/>
                    ))}
                    <tr>
                        <td>
                            <input type="text" placeholder="name" id="category_name" ref={nameRef}/>
                        </td>
                        <td>
                            <button className="button" onClick={() => addNewCategory(nameRef, setCategoriesList)}>
                                Add new category
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </Spin>
        </div>
    );
};
