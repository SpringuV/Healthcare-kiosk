import { Routes, Route } from 'react-router-dom'
import Service from './components/service'
import InputCCCD from './components/input_cccd'
import NonInsurrance from './components/insurance_not/non-insurrance'
import InfoInsurrance from './components/insurance/insurrance_info'
import NonInsurranceInfo from './components/insurance_not/non-insurrance-info'
import { useInsurrance } from './components/context/insurrance_context'
import RegisterSuccess from './components/register_success'
import UpdateInfoPatientInsurrance from './components/insurance/update_insurrance_info'
import LayoutDefault from './components/Layout/LayoutDefault'
import HomePage from './components/homepage'
import { useNavigate } from 'react-router-dom'
import PaymentWithQR from './components/payment'
import ResultSearch from './components/history_check'
import { useForm } from './components/context/form_context'
import LayoutHome from './components/Layout/LayoutHome'
import { usePatientHistory } from './components/context/patient_history_context'


function App() {
    const navigate = useNavigate()
    const { setFormData } = useForm()
    const { setInsurranceInfo } = useInsurrance()
    const { setPatientHistory } = usePatientHistory()
    return (

        <Routes>
            {/* Trang chủ: không có step */}
            <Route path="/" element={<LayoutHome />}>
                <Route path='/' element={<HomePage />} />
                <Route path="result-search" element={<InputCCCD mode="history" onClose={() => navigate(-1)} onSuccess={(data) => { setPatientHistory(data); navigate('/result') }} />} />
                <Route path="result" element={<ResultSearch onClose={() => navigate(-1)} />} />
            </Route>
            {/* Flow Bảo hiểm y tế */}
            <Route path="/insur" element={<LayoutDefault flowType="insurance" />}>
                <Route index element={<InputCCCD mode="insurance" onClose={() => navigate('/')} onSuccess={(data) => { setInsurranceInfo(data); navigate('/insur/info') }} />} />
                <Route path="info" element={<InfoInsurrance onClose={() => navigate('/service')} />} />
                <Route path="update-info" element={<UpdateInfoPatientInsurrance />} />
                <Route path="service" element={<Service />} />
                <Route path="confirm-registration" element={<RegisterSuccess />} />
            </Route>
            {/* Flow Dịch vụ (không BHYT) */}
            <Route path="/non-insur" element={<LayoutDefault flowType="non-insurance" />}>
                <Route index element={<InputCCCD mode="non-insurance" onClose={() => navigate('/')} onSuccess={(data) => { setFormData(data); navigate('/non-insur/info') }} />} />
                <Route path="register" element={<NonInsurrance onClose={() => navigate('/')} />} />
                <Route path="info" element={<NonInsurranceInfo />} />
                <Route path="service" element={<Service />} />
                <Route path="confirm-registration" element={<RegisterSuccess />} />
                <Route path="payment" element={<PaymentWithQR />} />
            </Route>
        </Routes>
    )
}

export default App