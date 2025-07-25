import { useNavigate } from 'react-router-dom'
import { useForm } from '../context/form_context'
function NonInsurranceInfo() {
    const navigate = useNavigate()
    const {formData} = useForm()
    return (
        <>
            <div className='fixed w-full inset-0 flex justify-center flex-col items-center backdrop-blur-sm p-1 bg-black/30'>
                <div className="min-w-[30vw]">
                    <div className=" flex justify-between items-center bg-colorOne p-2 rounded-t-md">
                        <h1 className="flex-1 text-center text-[22px] font-semibold text-white">Thông tin người khám</h1>
                        {/* <i className="fa-solid fa-xmark p-2 bg-slate-200 hover:bg-slate-300 h-8 w-8 flex justify-center items-center rounded-full" onClick={onClose}></i> */}
                    </div>
                    <div className="flex flex-col bg-white overflow-y-auto px-4 min-w-[30vw] pt-3">
                        <div className="flex justify-between py-2">
                            <label className="font-semibold w-1/2 border-r-slate-700">Họ và tên:</label>
                            <span>{formData.fullName}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <label className="font-semibold">Ngày sinh:</label>
                            <span>{formData.dob}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <label className="font-semibold">Địa chỉ:</label>
                            <span>{formData.address}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <label className="font-semibold">Căn cước công dân:</label>
                            <span>{formData.cccd}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <label className="font-semibold">Nghề nghiệp:</label>
                            <span>{formData.occupation}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <label className="font-semibold">Dân tộc:</label>
                            <span>{formData.ethnicity}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <label className="font-semibold">Số điện thoại:</label>
                            <span>{formData.phone}</span>
                        </div>
                    </div>
                    <div className="flex justify-center items-center p-3 bg-white rounded-b-md">
                        <button className="cursor-pointer px-3 py-1 bg-gradient-to-r from-colorTwo to-colorFive rounded-lg hover:from-green-500 hover:to-emerald-600 font-semibold text-white" onClick={() => navigate('/service')}>Bước tiếp theo</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NonInsurranceInfo