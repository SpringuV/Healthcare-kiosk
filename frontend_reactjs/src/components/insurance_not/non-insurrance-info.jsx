import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { select_check_patient_exist_data, select_patient_register_data } from '../../reducers'
import { useGlobalContext } from '../context/provider'
import { Helmet } from 'react-helmet-async'
import { Modal, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

function NonInsurranceInfo() {
    const navigate = useNavigate()
    const patient_exist = useSelector(select_patient_register_data)
    const patient_check = useSelector(select_check_patient_exist_data)
    const { setStateStep } = useGlobalContext()
    const [localLoading, setLocalLoading] = useState(false)
    const delay = [1500, 2000, 2500]
    useEffect(() => {
        setStateStep(1)
    }, [setStateStep])
    const handleNext = () => {
        navigate('/non-insur/service')
    }
    const handleBack = () => {
        navigate(-1)
    }

    const patient = patient_exist?.patient_id ? patient_exist : patient_check
    return (
        <>
            <Helmet>
                <title>Thông tin người khám</title>
            </Helmet>
            <Modal
                open={localLoading}
                footer={null}
                closable={false}
                centered
                maskClosable={false}
                styles={{ body: { textAlign: "center" } }}
            >
                <LoadingOutlined spin style={{ fontSize: 48, color: "#2563eb" }} className="mb-3" />
                <div className="text-lg font-semibold loading-dots">Đang xử lý, vui lòng chờ</div>
            </Modal>
            {patient_exist !== undefined ? (
                <div className='fixed w-full inset-0 flex justify-center flex-col items-center backdrop-blur-sm p-1 bg-black/30'>
                    <div className="w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw]">
                        <div className=" flex justify-between items-center bg-colorOne p-2 rounded-t-md">
                            <h1 className="flex-1 text-center text-[16px] md:text-[18px] lg:text-[20px] font-semibold text-white">Thông tin người khám</h1>
                        </div>
                        <div className="flex text-[14px] md:text-[16px] lg:text-[18px] flex-col bg-white overflow-y-auto px-4 pt-3">
                            <div className="flex justify-between py-2">
                                <label className="font-semibold w-1/3 border-r-slate-700">Họ và tên:</label>
                                <span className='text-center'>{patient.full_name}</span>
                            </div>
                            <div className="flex justify-between  py-2">
                                <label className="font-semibold w-1/3">Ngày sinh:</label>
                                <span className='text-center'>{patient.dob}</span>
                            </div>
                            <div className="flex justify-between  py-2">
                                <label className="font-semibold w-1/3">Giới tính:</label>
                                <span className='text-center'>{patient.gender}</span>
                            </div>
                            <div className="flex justify-between  py-2">
                                <label className="font-semibold w-1/3">Địa chỉ:</label>
                                <span className='text-right'>{patient.address}</span>
                            </div>
                            <div className="flex justify-between  py-2">
                                <label className="font-semibold">Căn cước công dân:</label>
                                <span className='text-center'>{patient.patient_id}</span>
                            </div>
                            <div className="flex justify-between  py-2">
                                <label className="font-semibold w-1/3">Nghề nghiệp:</label>
                                <span className='text-center'>{patient.job}</span>
                            </div>
                            <div className="flex justify-between  py-2">
                                <label className="font-semibold w-1/3">Dân tộc:</label>
                                <span className='text-center'>{patient.ethnic}</span>
                            </div>
                            <div className="flex justify-between  py-2">
                                <label className="font-semibold w-1/3">Số điện thoại:</label>
                                <span className='text-center'>{patient.phone_number}</span>
                            </div>
                        </div>
                        <div className="flex justify-center items-center p-3 bg-white rounded-b-md">
                            <Spin spinning={localLoading} indicator={<LoadingOutlined />}>
                                <button
                                    disabled={localLoading}
                                    className="hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer px-3 py-1 bg-gradient-to-r from-colorTwo to-colorFive rounded-lg hover:from-green-500 hover:to-emerald-600 font-semibold text-white"
                                    onClick={() => {
                                        setLocalLoading(true)
                                        setTimeout(() => {
                                            handleNext()
                                        }, delay[Math.floor(Math.random() * delay.length)])
                                    }}>
                                    {localLoading === true ? (<span className='loading-dots'>Đang xử lý</span>) : "Bước tiếp theo: Chọn dịch vụ khám"}
                                </button>
                            </Spin>
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