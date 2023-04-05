import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "./store";
import { Theme, DefaultTheme } from "@react-navigation/native";
export interface ThemeState extends Theme {}
const initialState = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		text: "#FFFFFF",
		primary: "#00CDB1",
		background: "#303030",
		card: "#181A1B"
	}
};
export const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		setTheme: (state, action: PayloadAction<Theme>) => {
			state = action.payload;
			return state;
		}
	}
});
export const { setTheme } = themeSlice.actions;
export const getTheme = (state: AppState) => state.theme;

export default themeSlice.reducer;
