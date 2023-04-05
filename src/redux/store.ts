import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import recordingsReducer from "./recordingsReducer";
import settingsReducer from "./settingsReducer";
import sortModeReducer from "./sortModeReducer";
import themeReducer from "./themeReducer";

export function makeStore() {
	return configureStore({
		reducer: { theme: themeReducer, sortMode: sortModeReducer, recordings: recordingsReducer, settings: settingsReducer },
		devTools: { trace: true, traceLimit: 10 }
	});
}
const store = makeStore();
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
