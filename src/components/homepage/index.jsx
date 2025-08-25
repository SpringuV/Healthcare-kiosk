import React, { useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

function HomePage() {
    const button = ['Khám bảo hiểm y tế', 'Khám dịch vụ']
    const navigate = useNavigate()

    const { setStateStep } = useOutletContext()
    useEffect(() => {
        setStateStep(1)
    }, [])
    return (
        <>
            <div className='text-center px-7 py-8  rounded-lg'>
                <div className='mb-3 text-colorOne font-bold text-[18px] lg:text-[25px]'>
                    <h1>CHỌN HÌNH THỨC KHÁM</h1>
                </div>
                <div className='flex justify-center'>
                    <div className='flex w-full gap-1 sm:w-[80%] lg:w-[45vw]'>
                        {button.map((text, i) => (
                            <div key={i} className='flex m-2 h-full w-1/2' onClick={() => {
                                if (text === "Khám bảo hiểm y tế") {
                                    navigate('/insur')
                                } else {
                                    navigate('/non-insur')
                                }
                            }}>
                                <div className='flex items-center justify-center h-[80%] w-full bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600'>
                                    <button className='cursor-pointer p-2 text-[14px] sm:text-[18px] font-semibold lg:text-[22px]'>{text}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='my-3 text-colorOne font-bold text-[18px] lg:text-[25px]'>
                    <h1>DỊCH VỤ KHÁC</h1>
                </div>
                <div className='flex w-full justify-center items-center gap-1'>
                    <div className='flex items-center justify-center h-[80%] bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600'>
                        <button className='px-5 py-1 text-[14px] sm:text-[18px] font-semibold lg:text-[22px]' onClick={() => navigate("/result-search")}>Tra cứu lịch sử khám</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage