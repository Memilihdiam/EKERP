import { get, apiEndpoints } from "../../../shared/api.js";

export async function fetchEmployeeList(){
    const response = await get(apiEndpoints.employee);
    return response.employees;
};

export async function fetchDataForAddEmp(){
    const response = await get(apiEndpoints.addData);
    return response;
}