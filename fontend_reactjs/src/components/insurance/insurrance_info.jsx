import { useNavigate } from "react-router-dom"
import React, { useEffect } from 'react'
import { useStateStep } from "../context/state_step_context"
import { useSelector } from "react-redux"
import { select_insurance_check_data } from "../../reducers"
function InfoInsurrance() {
    const navigate = useNavigate()
    const insurance_info = useSelector(select_insurance_check_data)

    const handleChangePath = () => {
        if (insurance_info.is_saved) {
            navigate('/insur/service')
        } else {
            navigate('/insur/update-info')
        }
    }

    const context = useStateStep()
    const { setStateStep } = context
    useEffect(() => {
        setStateStep(1)
    }, [setStateStep])
    return (
        <>
            {insurance_info ? (
                <div className='fixed w-full inset-0 flex justify-center flex-col items-center backdrop-blur-sm p-1 bg-black/30'>
                    <div className="w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw]">
                        <div className=" flex justify-between items-center bg-colorOne p-2 rounded-t-md">
                            <h1 className="flex-1 text-center r text-[16px] md:text-[18px] lg:text-[20px] font-semibold text-white">Thông tin bảo hiểm y tế</h1>
                            {/* <i className="fa-solid fa-xmark p-2 bg-slate-200 hover:bg-slate-300 h-8 w-8 flex justify-center items-center rounded-full" onClick={onClose}></i> */}
                        </div>
                        <div className="flex flex-col text-[14px] md:text-[16px] lg:text-[18px] bg-white overflow-y-auto px-4 pt-3">
                            <div className="flex justify-between py-2">
                                <label className="font-semibold w-1/2 border-r-slate-700">Họ và tên:</label>
                                <span>{insurance_info.full_name}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <label className="font-semibold">Ngày sinh:</label>
                                <span>{insurance_info.dob}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <label className="font-semibold">Số thẻ căn cước:</label>
                                <span>{insurance_info.citizen_id}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <label className="font-semibold">Thời hạn sử dụng:</label>
                                <span>{insurance_info.valid_from} -&gt; {insurance_info.expired}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <label className="font-semibold">Nơi Cấp:</label>
                                <span>{insurance_info.registration_place}</span>
                            </div>
                        </div>
                        <div className="flex justify-center items-center p-3 bg-white rounded-b-md">
                            <button className="px-3 py-1 bg-gradient-to-r from-colorTwo to-colorFive rounded-lg hover:from-green-500 hover:to-emerald-600 font-semibold text-white" onClick={handleChangePath}>Bước tiếp theo</button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className='text-white bg-red-500 p-2 rounded-md'>Không có dữ liệu. Vui lòng quay lại và nhập thông tin.</p>
            )}
        </>
    )
}

export default InfoInsurrance