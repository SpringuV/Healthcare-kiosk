
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import dashboardSlice from './dashboard/dashboard.slice';
import userSlice from './user/user.slice';
const loadState = () => {
    try {
        const serializedState = sessionStorage.getItem('reduxState');
        if (!serializedState) return undefined;
        return JSON.parse(serializedState);
    } catch {
        return undefined;
    }
};

const rootReducer = combineReducers({
    dashboard: dashboardSlice,
    users: userSlice
});

const preloadedState = loadState();
const store = configureStore({
    reducer: rootReducer,
    preloadedState,
});

store.subscribe(() => {
    sessionStorage.setItem('reduxState', JSON.stringify(store.getState()));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;