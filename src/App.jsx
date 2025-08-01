import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Service from './components/service'
import Header from './components/Header'
import InputCCCD from './components/Modal/inputCCCD'
import NonInsurrance from './components/Modal/non-insurrance'
import InfoInsurrance from './components/Modal/insurrance_info'
import StateStep from './components/state-step'
import NonInsurranceInfo from './components/Modal/non-insurrance-info'
import { InsurranceProvider } from './components/context/insurrance_context'
import RegisterSuccess from './components/service/register-success'
import { ServiceProvider } from './components/context/service_context'
import UpdateInfoPatientInsurrance from './components/Modal/update_insurrance_info'

function HomePage() {
    const button = ['Khám bảo hiểm y tế', 'Khám dịch vụ']
    const [checkButton, setCheckButtonShowModal] = useState(null)
    const navigate = useNavigate()
    return (
        <>
            <StateStep step={1} />
            <div className=' text-center px-7 py-8 bg-white rounded-lg'>
                <div className='mb-3 text-colorOne font-bold text-[25px]'>
                    <h1>CHỌN HÌNH THỨC KHÁM</h1>
                </div>
                <div className='flex justify-center'>
                    <div className='flex w-[40vw] justify-between items-center'>
                        {button.map((text, i) => (
                            <div key={i} className='m-2 w-1/2' onClick={() => {
                                setCheckButtonShowModal(text)
                                if (text === "Khám bảo hiểm y tế") {
                                    navigate('/bhyt')
                                }
                                else navigate('/non-bhyt/check') // nếu là khám dịch vụ thì điền thông tin
                            }}>
                                <div className='bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600'>
                                    <button className='cursor-pointer p-2 font-semibold text-[22px]'>{text}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

function BhytPage() {
    const navigate = useNavigate()
    return (
        <>
            <StateStep step={1} />
            <InputCCCD
                onClose={() => navigate('/')}
                onShowInputCheckInfo={() => { navigate('/bhyt/info') }}
                isInsurance={true}
            />
        </>
    )
}

function BhytInfoPage() {
    const navigate = useNavigate()
    return (
        <>
            <StateStep step={1} />
            <InfoInsurrance onClose={() => navigate('/service')} />
        </>
    )
}

function ServicePage() {
    return (
        <>
            <StateStep step={2} />
            <Service />
        </>
    )
}

function SelectKhamDichVu() {
    const navigate = useNavigate()
    return (
        <>
            <StateStep step={1} />
            <InputCCCD
                onClose={() => navigate('/')}
                onShowInputNonInsuranceInfo={() => navigate('/non-bhyt/info')}
                isInsurance={false}
            />
        </>
    )
}
function NonBhytInfoPage() {
    const [showDetailNonInsurranceInfo, setShowDetailNonInsurranceInfo] = useState(false)
    return (
        <>
            <StateStep step={1}></StateStep>
            <NonInsurranceInfo onClose={() => { setShowDetailNonInsurranceInfo(false) }}></NonInsurranceInfo>
        </>
    )
}

function PrintPDF_ConfirmOrder() {
    return (
        <>
            <StateStep step={3}></StateStep>
            <RegisterSuccess></RegisterSuccess>
        </>
    )
}

function CallUpdateInfoPatientInsurrance() {
    return (
        <>
            <StateStep step={1}></StateStep>
            <UpdateInfoPatientInsurrance></UpdateInfoPatientInsurrance>
        </>
    )
}

// Trang nhập thông tin chi tiết khi không tìm thấy CCCD (404)
function NonBhytRegisterPage() {
    const navigate = useNavigate()
    return (
        <>
            <StateStep step={1} />
            <NonInsurrance onClose={() => navigate('/')} />
        </>
    )
}

function App() {
    return (
        <InsurranceProvider>
            <ServiceProvider>
                <Router>
                    <Header />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/bhyt" element={<BhytPage />} />
                        <Route path="/bhyt/info" element={<BhytInfoPage />} />
                        <Route path="/service" element={<ServicePage />} />
                        <Route path='/non-bhyt/check' element={<SelectKhamDichVu />}></Route>
                        <Route path='/non-bhyt' element={<NonBhytRegisterPage />}></Route>
                        <Route path='/non-bhyt/info' element={<NonBhytInfoPage></NonBhytInfoPage>} />
                        <Route path='/confirm-registration' element={<PrintPDF_ConfirmOrder></PrintPDF_ConfirmOrder>}></Route>
                        <Route path='/bhyt/update-info' element={<CallUpdateInfoPatientInsurrance></CallUpdateInfoPatientInsurrance>}></Route>
                    </Routes>
                </Router>
            </ServiceProvider>
        </InsurranceProvider>
    )
}

export default App
