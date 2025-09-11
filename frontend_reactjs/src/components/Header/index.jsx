import { Tooltip, Modal, Spin } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LoadingOutlined } from '@ant-design/icons'
function Header() {
    const navigate = useNavigate()
    const [localLoading, setLocalLoading] = useState(false)
    const handleReturnHome = () => {
        Modal.confirm({
            title: "Xác nhận",
            content: "Bạn có chắc chắn muốn quay về trang chủ không?",
            okText: "Đồng ý",
            cancelText: "Hủy",
            onOk: () => {
                setLocalLoading(true)
                return new Promise((resolve) => {
                    setTimeout(() => {
                        setLocalLoading(false)
                        navigate("/", { replace: true })
                        resolve()
                    }, 1000) // delay 1s
                })
            }
        })
    }
    return (
        <>
            <Spin spinning={localLoading} fullscreen indicator={<LoadingOutlined spin />} />
            <div className='fixed top-0 flex p-4 w-full bg-colorOne z-[1000]'>
                <h1 className='flex-1 text-center text-white font-extrabold sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[28px] 2xl:text-[31px] '>BỆNH VIỆN THẬN HÀ NỘI</h1>
                <div className='flex items-center justify-end'>
                    <Tooltip mouseEnterDelay={0.2} title="Trang chủ">
                        <a onClick={handleReturnHome} className='text-white hover:text-blue-400'><i className='fa-solid fa-house'></i></a>
                    </Tooltip>
                </div>
            </div>
        </>
    )
}

export default Header