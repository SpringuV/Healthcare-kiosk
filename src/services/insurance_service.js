import { get } from "../utils/request"

export const check_insurance = async (citizen_id)=>{
    return await get(`/health-insurrances/${citizen_id}`)
}