import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppProviders from './components/context/provider/index.jsx'
import allReducers from './reducers/index.js'
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
const store = configureStore({
  reducer: allReducers,
  // thunk có sẵn, không cần thêm
})
createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <AppProviders>
            <App />
        </AppProviders>
    </Provider>
)
