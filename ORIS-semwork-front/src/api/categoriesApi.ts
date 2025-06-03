import axiosConfig from "../axiosConfig";
import {Category} from "@types/models";

export const fetchCategories = async (setCategoriesList: (newValue: Category[]) => void) => {
    try {
        const response = await axiosConfig.get("/categories/all")
        setCategoriesList(response.data)
    } catch (error) {
        alert(`Error with loading categories: ${error.message}`)
    }
};


export const addNewCategory = async (nameRef: React.RefObject<HTMLInputElement>, setCategoriesList: (newValue: Category[]) => void) => {
    const name = nameRef.current?.value.trim();
    if (!name) {
        alert("Category name cannot be null");
        return;
    }

    try {
        await axiosConfig.post("/categories/add", {name});
        fetchCategories(setCategoriesList);
        if (nameRef.current) nameRef.current.value = "";
    } catch (error) {
        alert(error.response?.data)
    }
};