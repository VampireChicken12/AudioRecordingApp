import { SortMode } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "./store";
const initialState = "date-desc" as SortMode;
export const sortModeSlice = createSlice({
	name: "sortMode",
	initialState,
	reducers: {
		setSortMode: (state, action: PayloadAction<SortMode>) => {
			state = action.payload;
			return state;
		}
	}
});
export const { setSortMode } = sortModeSlice.actions;
export const getSortMode = (state: AppState) => state.sortMode;
export default sortModeSlice.reducer;
