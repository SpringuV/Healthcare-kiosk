import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { select_check_patient_exist_data } from '../../reducers'
import { useGlobalContext } from '../context/provider'
function NonInsurranceInfo() {
    const navigate = useNavigate()
    const patient_exist = useSelector(select_check_patient_exist_data)
    const { setStateStep } = useGlobalContext()
    useEffect(() => {
        setStateStep(1)
    }, [setStateStep])

    const handleNext = () => {
        navigate('/non-insur/service')
    }
    const handleBack = () => {
        navigate(-1)
    }
    return (
        <>
            {patient_exist !== undefined ? (
                <div className='fixed w-full inset-0 flex justify-center flex-col items-center backdrop-blur-sm p-1 bg-black/30'>
                <div className="w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw]">
                    <div className=" flex justify-between items-center bg-colorOne p-2 rounded-t-md">
                        <h1 className="flex-1 text-center text-[16px] md:text-[18px] lg:text-[20px] font-semibold text-white">Thông tin người khám</h1>
                    </div>
                    <div className="flex text-[14px] md:text-[16px] lg:text-[18px] flex-col bg-white overflow-y-auto px-4 pt-3">
                        <div className="flex justify-between py-2">
                            <label className="font-semibold w-1/3 border-r-slate-700">Họ và tên:</label>
                            <span className='text-center'>{patient_exist.full_name}</span>
                        </div>
                        <div className="flex justify-between  py-2">
                            <label className="font-semibold w-1/3">Ngày sinh:</label>
                            <span className='text-center'>{patient_exist.dob}</span>
                        </div>
                        <div className="flex justify-between  py-2">
                            <label className="font-semibold w-1/3">Giới tính:</label>
                            <span className='text-center'>{patient_exist.gender}</span>
                        </div>
                        <div className="flex justify-between  py-2">
                            <label className="font-semibold w-1/3">Địa chỉ:</label>
                            <span className='text-center'>{patient_exist.address}</span>
                        </div>
                        <div className="flex justify-between  py-2">
                            <label className="font-semibold w-1/3">Căn cước công dân:</label>
                            <span className='text-center'>{patient_exist.patient_id}</span>
                        </div>
                        <div className="flex justify-between  py-2">
                            <label className="font-semibold w-1/3">Nghề nghiệp:</label>
                            <span className='text-center'>{patient_exist.job}</span>
                        </div>
                        <div className="flex justify-between  py-2">
                            <label className="font-semibold w-1/3">Dân tộc:</label>
                            <span className='text-center'>{patient_exist.ethnic}</span>
                        </div>
                        <div className="flex justify-between  py-2">
                            <label className="font-semibold w-1/3">Số điện thoại:</label>
                            <span className='text-center'>{patient_exist.phone_number}</span>
                        </div>
                    </div>
                    <div className="flex justify-center items-center p-3 bg-white rounded-b-md">
                        <button className="cursor-pointer px-3 py-1 bg-gradient-to-r from-colorTwo to-colorFive rounded-lg hover:from-green-500 hover:to-emerald-600 font-semibold text-white" onClick={handleNext}>Bước tiếp theo</button>
                    </div>
                </div>
            </div>
            ) : (<div className='fixed w-full inset-0 flex justify-center flex-col items-center backdrop-blur-sm p-1 bg-black/30'>
                <div className="w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw]">
                    <div>
                        Không có thông tin người khám
                    </div>
                    <button onClick={handleBack}>Quay lại</button>
                </div>
            </div>)}
        </>
    )
}

export default NonInsurranceInfo