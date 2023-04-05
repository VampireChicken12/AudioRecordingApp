import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState } from "./store";
import { SettingsBase } from "@/types";
import { storage } from "@/utilities/storage";

export const defaultSettings = {
	audioSource: {
		value: "1",
		title: "Audio source",
		type: "list" as const,
		labels: ["Microphone", "Voice Call", "Voice Downlink", "Voice Uplink"],
		values: ["1", "4", "3", "2"],
		weight: 0
	},
	samplingRate: {
		value: "48000",
		title: "Sample rate",
		type: "list" as const,
		labels: [
			"48kHz - DVD quality",
			"44.1kHz - CD quality",
			"32kHz - FM Radio quality",
			"22.05kHz - AM Radio quality",
			"16kHz - Tape Recorder quality",
			"11.025kHz - Dictation quality",
			"8kHz - Phone quality"
		],
		values: ["48000", "44100", "32000", "22050", "16000", "11025", "8000"],
		weight: 1
	},
	format: {
		value: "mp4",
		title: "Recording format",
		type: "list" as const,
		labels: [
			"AMR (.3gp) - Low quality - Small file size",
			"AAC (.mp4) - Good quality - Medium file size",
			"FLAC (.flac) - Best quality - Huge file size"
		],
		values: ["3gp", "mp4", "flac"],
		weight: 2
	},
	bitrate: {
		type: "list" as const,
		value: "128000",
		title: "Encoder bitrate",
		labels: ["320kbps", "256kbps", "192kbps", "128kbps", "96kbps", "64kbps", "48kbps", "32kbps"],
		values: ["320000", "256000", "192000", "128000", "96000", "64000", "48000", "32000"],
		weight: 3
	},
	askForFileName: {
		type: "switch" as const,
		title: "Ask for file name",
		description: "Ask for file name when recording stops",
		value: false,
		weight: 5
	},
	availableStorage: {
		type: "details" as const,
		details: "N/A",
		title: "Available storage",
		weight: 6
	}
} satisfies SettingsBase;
export type TSettings = typeof defaultSettings;
const storageValues = Object.entries(defaultSettings)
	.map(([settingKey]) => {
		return storage.getString(settingKey) && { [settingKey]: JSON.parse(storage.getString(settingKey) as string) };
	})
	.filter(Boolean);
const storageSettings = storageValues.length && storageValues.reduce((prev, curr) => ({ ...prev, ...curr }));
const initialState = storageSettings ? (storageSettings as TSettings) : defaultSettings;
export const settingsSlice = createSlice({
	name: "settings",
	initialState,
	reducers: {
		setSettings: (state, action: PayloadAction<TSettings>) => {
			state = action.payload;
			return state;
		}
	}
});
export const { setSettings } = settingsSlice.actions;
export const getSettings = (state: AppState) => state.settings;
export default settingsSlice.reducer;
