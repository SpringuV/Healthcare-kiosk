import { useState } from 'react'
import Service from './components/service'
import Header from './components/Header'
import Insurrance from './components/Modal/insurrance'
import NonInsurrance from './components/Modal/non-insurrance'
function App() {
    const button = ['Khám bảo hiểm y tế', 'Khám dịch vụ']
    const [checkButton, setCheckButtonShowModal] = useState(null)
    return (
        <>
            <Header></Header>
            {/* <Service></Service> */}
            <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center px-7 py-4 bg-white rounded-lg'>
                <div className='mb-3 text-colorOne font-bold text-[25px]'>
                    <h1>CHỌN HÌNH THỨC KHÁM</h1>
                </div>
                <div className='flex w-[40vw] justify-between items-center'>
                    {button.map((text, i) => (
                        <div key={i} className='m-2 w-1/2' onClick={() => setCheckButtonShowModal(text)}>
                            <div className='bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600'>
                                <button className='p-2 font-semibold text-[22px]'>{text}</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {checkButton === "Khám bảo hiểm y tế" && <Insurrance onClose={() => setCheckButtonShowModal(null)}></Insurrance>}
            {checkButton === "Khám dịch vụ" && <NonInsurrance onClose={() => setCheckButtonShowModal(null)}></NonInsurrance>}
        </>
    )
}

export default App
