import store, { useAppDispatch, useAppSelector } from "@/redux/store";
import { ThemeState } from "@/redux/themeReducer";
import { Recording, SortField, SortOrder } from "@/types";
import React, { useState, Dispatch, SetStateAction } from "react";
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native";
import { Provider } from "react-redux";
import ReactNativeFileSystem from "react-native-fs";
import { getRecordings, setRecordings } from "@/redux/recordingsReducer";
import { RecordingsArray, sortRecordings } from "@/utilities";
import { getSortMode } from "@/redux/sortModeReducer";

export default function RecordingRenameModal({
	theme,
	recording,
	setRenameModalVisible
}: {
	theme: ThemeState;
	recording: Recording;
	setRenameModalVisible: Dispatch<SetStateAction<boolean>>;
}) {
	const dispatch = useAppDispatch();
	const recordings = useAppSelector(getRecordings);
	const sortMode = useAppSelector(getSortMode);
	const recordingPathWithoutName = recording.path.substring(0, recording.path.lastIndexOf("/Recordings/") + 12).trim();
	const recordingName = recording.name.substring(0, recording.name.lastIndexOf(".")).trim();
	const recordingExtension = recording.name.slice(recording.name.lastIndexOf(".")).trim();
	const [newRecordingName, setNewRecordingName] = useState<string>(recordingName);

	return (
		<Provider store={store}>
			<View style={styles.centeredView}>
				<View style={[styles.modalView, { backgroundColor: "#424242" }]}>
					<Text style={[{ color: theme.colors.text, fontWeight: "bold", fontSize: 18, marginBottom: 8 }]}>Rename recording</Text>
					<View style={{ flexDirection: "column", flex: 1, margin: 4 }}>
						<TextInput
							onChangeText={setNewRecordingName}
							value={newRecordingName}
							style={{ borderBottomColor: theme.colors.card, borderBottomWidth: 2 }}
						/>
					</View>
					<View style={{ flexDirection: "row", flex: 1, justifyContent: "space-between" }}>
						<TouchableOpacity
							accessibilityRole="button"
							onPress={async () => {
								setRenameModalVisible(false);
							}}
							style={{ flex: 1 }}
						>
							<Text style={styles.textStyle}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							accessibilityRole="button"
							onPress={() => {
								ReactNativeFileSystem.moveFile(recording.path, recordingPathWithoutName + newRecordingName + recordingExtension);

								const [sortField, sortOrder] = sortMode.split("-") as [SortField, SortOrder];
								dispatch(
									setRecordings(
										sortRecordings(
											new RecordingsArray([
												...recordings.filter((rec) => rec.path !== recording.path),
												{ ...recording, path: recordingPathWithoutName + newRecordingName + recordingExtension }
											]),
											sortField,
											sortOrder
										)
									)
								);
								setRenameModalVisible(false);
							}}
							style={{ flex: 1 }}
						>
							<Text style={styles.textStyle}>Rename</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Provider>
	);
}
const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	modalView: {
		margin: 20,
		borderRadius: 2,
		paddingTop: 20,
		padding: 25,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		flexDirection: "column"
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 16
	}
});
