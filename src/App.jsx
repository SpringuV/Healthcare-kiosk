import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Service from './components/service'
import Header from './components/Header'
import Insurrance from './components/Modal/insurrance'
import NonInsurrance from './components/Modal/non-insurrance'
import InfoInsurrance from './components/Modal/insurrance_info'
import StateStep from './components/state-step'
import NonInsurranceInfo from './components/Modal/non-insurrance-info'

function HomePage() {
    const button = ['Khám bảo hiểm y tế', 'Khám dịch vụ']
    const [checkButton, setCheckButtonShowModal] = useState(null)
    const navigate = useNavigate()
    return (
        <>
            <StateStep step={1} />
            <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center px-7 py-4 bg-white rounded-lg'>
                <div className='mb-3 text-colorOne font-bold text-[25px]'>
                    <h1>CHỌN HÌNH THỨC KHÁM</h1>
                </div>
                <div className='flex w-[40vw] justify-between items-center'>
                    {button.map((text, i) => (
                        <div key={i} className='m-2 w-1/2' onClick={() => {
                            setCheckButtonShowModal(text)
                            if (text === "Khám bảo hiểm y tế") {
                                navigate('/bhyt')
                            }
                            else navigate('/non-bhyt') // nếu là khám dịch vụ thì điền thông tin
                        }}>
                            <div className='bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600'>
                                <button className='cursor-pointer p-2 font-semibold text-[22px]'>{text}</button>
                            </div>
                        </div>
                    ))}
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
            <Insurrance
                onClose={() => navigate('/')}
                onShowInputCheckInfo={() => navigate('/bhyt/info')}
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
    const [showCheckService, setShowCheckService] = useState(false)
    return (
        <>
            <StateStep step={1} />
            <NonInsurrance onShowInputCheckInfoNon={()=> {setShowCheckService(true);navigate('/non-bhyt/info')}} onClose={() => { setShowCheckService(false); navigate(-1) }}></NonInsurrance>
        </>
    )
}

function NonBhytInfoPage() {
    const navigate = useNavigate()
    const [showDetailNonInsurranceInfo, setShowDetailNonInsurranceInfo] = useState(false)
    return (
        <>
            <StateStep step={1}></StateStep>
            <NonInsurranceInfo  onClose={()=> {setShowDetailNonInsurranceInfo(false)}}></NonInsurranceInfo>
        </>
    )
}

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/bhyt" element={<BhytPage />} />
                <Route path="/bhyt/info" element={<BhytInfoPage />} />
                <Route path="/service" element={<ServicePage />} />
                <Route path='/non-bhyt' element={<SelectKhamDichVu />}></Route>
                <Route path='/non-bhyt/info' element={<NonBhytInfoPage></NonBhytInfoPage>} />
            </Routes>
        </Router>
    )
}


export default App
