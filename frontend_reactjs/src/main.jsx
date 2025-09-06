import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import persistedReducer from './reducers/index.js'
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react"
import { GlobalContextProvider } from './components/context/provider.jsx'
import { BrowserRouter } from 'react-router-dom'

const store = configureStore({
    reducer: persistedReducer,
    // thunk có sẵn, không cần thêm
})

const persistor = persistStore(store)

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <GlobalContextProvider>
                    <App />
                </GlobalContextProvider>
            </BrowserRouter>
        </PersistGate>
    </Provider>
)
