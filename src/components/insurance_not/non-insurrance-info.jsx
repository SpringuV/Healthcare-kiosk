import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useStateStep } from '../context/state_step_context'
import { useSelector } from 'react-redux'
function NonInsurranceInfo() {
    const navigate = useNavigate()
    const stateData = useSelector(state => state.non_insurance_reducer)
    const context = useStateStep()
    const { setStateStep } = context
    useEffect(() => {
        setStateStep(1)
    }, [setStateStep])

    const handleNext = () => {
        navigate('/non-insur/service')
    }
    return (
        <>
            <div className='fixed w-full inset-0 flex justify-center flex-col items-center backdrop-blur-sm p-1 bg-black/30'>
                <div className="w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw]">
                    <div className=" flex justify-between items-center bg-colorOne p-2 rounded-t-md">
                        <h1 className="flex-1 text-center text-[16px] md:text-[18px] lg:text-[20px] font-semibold text-white">Thông tin người khám</h1>
                    </div>
                    <div className="flex text-[14px] md:text-[16px] lg:text-[18px] flex-col bg-white overflow-y-auto px-4 pt-3">
                        <div className="flex justify-between py-2">
                            <label className="font-semibold w-1/3 border-r-slate-700">Họ và tên:</label>
                            <span className='text-center'>{stateData.full_name}</span>
                        </div>
                        <div className="flex justify-between  py-2">
                            <label className="font-semibold w-1/3">Ngày sinh:</label>
                            <span className='text-center'>{stateData.dob}</span>
                        </div>
                        <div className="flex justify-between  py-2">
                            <label className="font-semibold w-1/3">Giới tính:</label>
                            <span className='text-center'>{stateData.gender === true ? "Nam" : "Nữ"}</span>
                        </div>
                        <div className="flex justify-between  py-2">
                            <label className="font-semibold w-1/3">Địa chỉ:</label>
                            <span className='text-center'>{stateData.address}</span>
                        </div>
                        <div className="flex justify-between  py-2">
                            <label className="font-semibold w-1/3">Căn cước công dân:</label>
                            <span className='text-center'>{stateData.patient_id}</span>
                        </div>
                        <div className="flex justify-between  py-2">
                            <label className="font-semibold w-1/3">Nghề nghiệp:</label>
                            <span className='text-center'>{stateData.job}</span>
                        </div>
                        <div className="flex justify-between  py-2">
                            <label className="font-semibold w-1/3">Dân tộc:</label>
                            <span className='text-center'>{stateData.ethnic}</span>
                        </div>
                        <div className="flex justify-between  py-2">
                            <label className="font-semibold w-1/3">Số điện thoại:</label>
                            <span className='text-center'>{stateData.phone_number}</span>
                        </div>
                    </div>
                    <div className="flex justify-center items-center p-3 bg-white rounded-b-md">
                        <button className="cursor-pointer px-3 py-1 bg-gradient-to-r from-colorTwo to-colorFive rounded-lg hover:from-green-500 hover:to-emerald-600 font-semibold text-white" onClick={handleNext}>Bước tiếp theo</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NonInsurranceInfo