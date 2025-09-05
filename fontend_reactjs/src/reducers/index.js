import { patient_register_reducer, check_insurance_reducer, check_patient_exist_reducer } from "./patient"
import { combineReducers } from "redux"
import { createSelector } from 'reselect'

const allReducers = combineReducers({
    patient_register: patient_register_reducer,
    insurance_check: check_insurance_reducer,
    check_patient_exist: check_patient_exist_reducer,
})

// Patient Register selectors
export const select_register_loading = (state) => state.patient_register.loading
export const select_register_error = (state) => state.patient_register.error
export const select_is_registered = (state) => state.patient_register.is_registered
export const select_register_message = (state) => state.patient_register.message
export const select_patient_register_data = (state) => state.patient_register

// Insurance Check selectors
export const select_insurance_check = (state) => state.insurance_check
export const select_insurance_loading = (state) => state.insurance_check.loading
export const select_insurance_error = (state) => state.insurance_check.error
export const select_has_insurance = (state) => state.insurance_check.has_insurance
export const select_need_register = (state) => state.insurance_check.need_register
export const select_insurance_message = (state) => state.insurance_check.message
export const select_insurance_check_data = (state) => state.insurance_check

// Compound selectors
export const select_can_proceed = createSelector(
  (state) => state.insurance_check,
  (insurance) => insurance.has_insurance && insurance.is_activate && insurance.is_saved
)

export const select_should_register = createSelector(
  (state) => state.insurance_check,
  (insurance) => insurance.need_register || (!insurance.is_saved && insurance.has_insurance)
)

// Check patient exist selectors
export const select_check_patient_exist_loading = (state) => state.check_patient_exist.loading
export const select_check_patient_exist_error = (state) => state.check_patient_exist.error
export const select_check_patient_exist_message = (state) => state.check_patient_exist.message
export const select_check_patient_exist_need_register = (state) => state.check_patient_exist.need_register
export const select_check_patient_exist_data = (state) => state.check_patient_exist

export default allReducers