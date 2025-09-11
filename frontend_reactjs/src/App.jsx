import { Routes, Route } from 'react-router-dom'
import Service from './components/service_selection'
import InputCCCD from './components/input_cccd'
import Register from './components/register-user'
import InfoInsurrance from './components/insurance/insurrance_info'
import NonInsurranceInfo from './components/insurance_not/non-insurrance-info'
import RegisterSuccess from './components/register_success'
import LayoutDefault from './components/Layout/LayoutDefault'
import HomePage from './components/homepage'
import { useNavigate } from 'react-router-dom'
import PaymentControl from './components/payment/PaymentControl'
import PaymentWithQR from './components/payment/PaymentWithQR'
import ResultSearch from './components/history_check'
import LayoutHome from './components/Layout/LayoutHome'
import { useGlobalContext } from './components/context/provider'
import { useDispatch } from 'react-redux'
import { clear_patient_register } from './actions/patient'

function App() {
    const navigate = useNavigate()
    const { clearStateStepAndFlowType } = useGlobalContext()
    const dispatch = useDispatch()
    return (
        <Routes>
            {/* Trang chủ: không có step */}
            <Route path="/" element={<LayoutHome />}>
                <Route index element={<HomePage />} />
                <Route path="result-search" element={<InputCCCD mode="history" onClose={() => {
                    navigate(-1)
                    clearStateStepAndFlowType()
                }} onSuccess={() => { navigate('/result') }} />} />
                <Route path="result" element={<ResultSearch onClose={() => navigate(-1)} />} />
            </Route>
            {/* Flow Bảo hiểm y tế */}
            <Route path="/insur" element={<LayoutDefault flowType="insurance" />}>
                <Route index element={<InputCCCD mode="insurance" onClose={() => {
                    navigate(-1)
                    clearStateStepAndFlowType()
                }} onSuccess={() => { navigate('/insur/info') }} />} />
                <Route path="info" element={<InfoInsurrance onClose={() => navigate('/service')} />} />
                <Route path="register" element={<Register onClose={() => navigate('/')} />} />
                <Route path="service" element={<Service />} />
                <Route path="confirm-registration" element={<RegisterSuccess />} />
            </Route>
            {/* Flow Dịch vụ (không BHYT) */}
            <Route path="/non-insur" element={<LayoutDefault flowType="non-insurance" />}>
                <Route index element={<InputCCCD mode="non-insurance" onClose={() => {
                    navigate(-1)
                    clearStateStepAndFlowType()
                }} onSuccess={() => {navigate('/non-insur/info') }} />} />
                <Route path="register" element={<Register onClose={() => {navigate('/'); dispatch(clear_patient_register())}} />} />
                <Route path="info" element={<NonInsurranceInfo />} />
                <Route path="service" element={<Service />} />
                <Route path="confirm-registration" element={<RegisterSuccess />} />
                <Route path="payment" element={<PaymentControl />} />
                <Route path="banking" element={<PaymentWithQR />} />
            </Route>
        </Routes>
    )
}

export default App