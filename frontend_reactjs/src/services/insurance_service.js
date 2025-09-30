import { get } from "../utils/request"

export const check_insurance = async (citizen_id)=>{
    return await get(`/patient/health_insurances/${citizen_id}`)
}