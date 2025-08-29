import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useStateStep } from "../context/state_step_context"

function PaymentControl() {
    const button = ['Tiền mặt', 'Chuyển khoản']
    const info = ['|Thanh toán bằng tiền mặt tại quầy|', '|Chuyển khoản ngân hàng thông qua mã QR|']
    const navigate = useNavigate()

    const { stateStep, setStateStep } = useStateStep()
    useEffect(() => {
        if (stateStep !== 3) {
            setStateStep(3)
        }
            
    }, [stateStep, setStateStep])

    return (
        <>
            <div className='text-center px-7 py-8  rounded-lg'>
                <div className='mb-3 text-colorOne font-bold text-[18px] lg:text-[25px]'>
                    <h1>CHỌN HÌNH THỨC THANH TOÁN</h1>
                </div>
                <div className='flex justify-center'>
                    <div className='flex w-full gap-1 sm:w-[80%] lg:w-[45vw]'>
                        {button.map((text, i) => (
                            <div key={i} className='flex m-2 h-full w-1/2' onClick={() => {
                                if (text === "Tiền mặt") {
                                    navigate('/non-insur/confirm-registration')
                                } else {
                                    navigate('/non-insur/banking')
                                }
                            }}>
                                <div className='flex flex-col items-center justify-center h-[80%] w-full'>
                                    <div className='w-full bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600'>
                                        <button className='cursor-pointer p-2 text-[14px] sm:text-[18px] font-semibold lg:text-[22px]'>{text}</button>
                                    </div>
                                    <div className="mt-2 text-center text-gray-400">
                                        {info[i]}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentControl