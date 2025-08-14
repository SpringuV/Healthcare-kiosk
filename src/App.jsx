import { Routes, Route } from 'react-router-dom'
import Service from './components/service'
import InputCCCD from './components/Modal/inputCCCD'
import NonInsurrance from './components/Modal/non-insurrance'
import InfoInsurrance from './components/Modal/insurrance_info'
import NonInsurranceInfo from './components/Modal/non-insurrance-info'
import { InsurranceProvider } from './components/context/insurrance_context'
import RegisterSuccess from './components/service/register-success'
import { ServiceProvider } from './components/context/service_context'
import UpdateInfoPatientInsurrance from './components/Modal/update_insurrance_info'
import LayoutDefault from './components/Layout/LayoutDefault'
import HomePage from './components/Modal/homepage'
import { useNavigate } from 'react-router-dom'


function App() {
    const navigate = useNavigate()
    return (
        <InsurranceProvider>
            <ServiceProvider>
                <Routes>
                    <Route path='/' element={<LayoutDefault></LayoutDefault>}>
                        <Route path='/' element={<HomePage></HomePage>} context={{ stateStep: 1 }}></Route>
                        <Route path='insur' element={<InputCCCD onClose={() => navigate('/')}
                            onShowInputCheckInfo={() => navigate('/insur/info')}
                            isInsurance={true}></InputCCCD>} context={{ stateStep: 1 }}>
                            <Route path='info' element={<InfoInsurrance onClose={() => navigate('/service')}></InfoInsurrance>} context={{ stateStep: 1 }}></Route>
                            <Route path='update-info' element={<UpdateInfoPatientInsurrance></UpdateInfoPatientInsurrance>} context={{stateStep: 1}}></Route>
                        </Route>
                        <Route path='service' element={<Service></Service>} context={{ stateStep: 2 }}></Route>
                        <Route path='non-insur' element={<InputCCCD onClose={() => navigate('/')}
                            onShowInputNonInsuranceInfo={() =>navigate('/non-insur/info')}
                            isInsurance={false}></InputCCCD>} context={{ stateStep: 1 }}>
                            <Route path='register' element={<NonInsurrance onClose={() => navigate('/')}></NonInsurrance>} context={{ stateStep: 1 }}></Route>
                            <Route path='info' element={<NonInsurranceInfo></NonInsurranceInfo>} context={{stateStep: 1}}></Route>
                        </Route>
                        <Route path='confirm-registration' element={<RegisterSuccess></RegisterSuccess>} context={{stateStep: 3}}></Route>

                    </Route>
                </Routes>
            </ServiceProvider>
        </InsurranceProvider>
    )
}

export default App