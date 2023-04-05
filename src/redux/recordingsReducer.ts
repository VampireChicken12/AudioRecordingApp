import { RecordingsArray } from "@/utilities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "./store";
const initialState = new RecordingsArray();
export const recordingsSlice = createSlice({
	name: "recordings",
	initialState,
	reducers: {
		setRecordings: (state, action: PayloadAction<RecordingsArray>) => {
			state = action.payload;
			return state;
		}
	}
});
export const { setRecordings } = recordingsSlice.actions;
export const getRecordings = (state: AppState) => state.recordings;
export default recordingsSlice.reducer;
