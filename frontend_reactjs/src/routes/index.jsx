import HomePage from "../components/homepage";
import LayoutDefault from "../components/Layout/LayoutDefault";

export const routes = [
    {
        path: '/',
        element: <LayoutDefault></LayoutDefault>,
        children: [
            {
                path: '/',
                element: <HomePage></HomePage>
            }
        ]
    }
]

// <Routes >
//         <Route path='/' element={<LayoutDefault></LayoutDefault>}>
//             <Route index element={<HomePage></HomePage>}></Route>
//             <Route path='insur' element={<InputCCCD mode="insurance" onClose={() => navigate('/')}
//                 onSuccess={(data) => {
//                     setInsurranceInfo(data)
//                     navigate('/insur/info')
//                 }}></InputCCCD>}>
//                 <Route path='info' element={<InfoInsurrance onClose={() => navigate('/service')}></InfoInsurrance>}></Route>
//                 <Route path='update-info' element={<UpdateInfoPatientInsurrance></UpdateInfoPatientInsurrance>}></Route>
//             </Route>
//             <Route path='result-search' element={<InputCCCD mode="history" onClose={() => navigate(-1)}
//                 onSuccess={(data) => {
//                     navigate('/result-search/result', { state: data })
//                 }}></InputCCCD>}>
//                 <Route path='result' element={<ResultSearch onClose={() => navigate(-1)}></ResultSearch>}></Route>
//             </Route>
//             <Route path='service' element={<Service></Service>}></Route>
//             <Route path='non-insur' element={<InputCCCD mode="non-insurance" onClose={() => navigate('/')}
//                 onSuccess={(data) => {
//                     setFormData(data)
//                     navigate('/non-insur/info')
//                 }}></InputCCCD>}>
//                 <Route path='register' element={<NonInsurrance onClose={() => navigate('/')}></NonInsurrance>}></Route>
//                 <Route path='info' element={<NonInsurranceInfo></NonInsurranceInfo>}></Route>
//             </Route>
//             <Route path='confirm-registration' element={<RegisterSuccess></RegisterSuccess>}></Route>

//         </Route>
//         <Route path='payment' element={<PaymentWithQR></PaymentWithQR>}></Route>
//     </Routes >