import non_insurance_reducer from "./non_insurance";
import { combineReducers } from "redux"
const allReducers = combineReducers({
    non_insurance_reducer,
})

export default allReducers