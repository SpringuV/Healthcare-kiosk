import { Routes, Route } from 'react-router-dom'
import Service from './components/service'
import InputCCCD from './components/Modal/inputCCCD'
import NonInsurrance from './components/Modal/non-insurrance'
import InfoInsurrance from './components/Modal/insurrance_info'
import NonInsurranceInfo from './components/Modal/non-insurrance-info'
import { InsurranceProvider } from './components/context/insurrance_context'
import RegisterSuccess from './components/Modal/register-success'
import { ServiceProvider } from './components/context/service_context'
import UpdateInfoPatientInsurrance from './components/Modal/update_insurrance_info'
import LayoutDefault from './components/Layout/LayoutDefault'
import HomePage from './components/Modal/homepage'
import { useNavigate } from 'react-router-dom'
import PaymentWithQR from './components/Modal/payment'
import ResultSearch from './components/result_search'


function App() {
    const navigate = useNavigate()
    return (
        <InsurranceProvider>
            <ServiceProvider>
                <Routes>
                    <Route path='/' element={<LayoutDefault></LayoutDefault>}>
                        <Route index element={<HomePage></HomePage>}></Route>
                        <Route path='insur' element={<InputCCCD onClose={() => navigate('/')}
                            onShowInputCheckInfo={() => navigate('/insur/info')}
                            isInsurance={true}></InputCCCD>}>
                            <Route path='info' element={<InfoInsurrance onClose={() => navigate('/service')}></InfoInsurrance>}></Route>
                            <Route path='update-info' element={<UpdateInfoPatientInsurrance></UpdateInfoPatientInsurrance>}></Route>
                        </Route>
                        <Route path='result-search' element={<InputCCCD onClose={() => navigate(-1)} onShowInputCheckResult={() => navigate('/result-search/result')}></InputCCCD>}>
                            <Route path='result' element={<ResultSearch onClose={() => navigate(-1)}></ResultSearch>}></Route>
                        </Route>
                        <Route path='service' element={<Service></Service>}></Route>
                        <Route path='non-insur' element={<InputCCCD onClose={() => navigate('/')}
                            onShowInputNonInsuranceInfo={() => navigate('/non-insur/info')}
                            isInsurance={false}></InputCCCD>}>
                            <Route path='register' element={<NonInsurrance onClose={() => navigate('/')}></NonInsurrance>}></Route>
                            <Route path='info' element={<NonInsurranceInfo></NonInsurranceInfo>}></Route>
                        </Route>
                        <Route path='confirm-registration' element={<RegisterSuccess></RegisterSuccess>}></Route>

                    </Route>
                    <Route path='payment' element={<PaymentWithQR></PaymentWithQR>}></Route>
                </Routes>
            </ServiceProvider>
        </InsurranceProvider>
    )
}

export default App