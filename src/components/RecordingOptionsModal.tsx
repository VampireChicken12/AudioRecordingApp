import store from "@/redux/store";
import { ThemeState } from "@/redux/themeReducer";
import { Recording } from "@/types";
import React, { Dispatch, SetStateAction } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReactNativeFileSystem from "react-native-fs";
import Share from "react-native-share";
import { Provider } from "react-redux";

export default function RecordingOptionsModal({
	theme,
	recording,
	setRecordingOptionsModalVisible,
	setRenameModalVisible
}: {
	theme: ThemeState;
	recording: Recording;
	setRecordingOptionsModalVisible: Dispatch<SetStateAction<boolean>>;
	setRenameModalVisible: Dispatch<SetStateAction<boolean>>;
}) {
	const recordingName = recording.name.substring(0, recording.name.lastIndexOf("."));
	// TODO: implement set as and open with buttons
	return (
		<Provider store={store}>
			<View style={styles.centeredView}>
				<View style={[styles.modalView, { backgroundColor: "#424242" }]}>
					<Text style={[{ color: theme.colors.text, fontWeight: "bold", fontSize: 20, marginBottom: 8 }]}>{recordingName}</Text>
					<View style={{ flexDirection: "column", flex: 1, alignSelf: "flex-start" }}>
						<TouchableOpacity
							accessibilityRole="button"
							onPress={async () => {
								Share.open({
									url: `file://${recording.path}`,
									title: `Share ${recording.name}`
								})
									.then((res) => {
										console.log(res);
									})
									.catch((err) => {
										err && console.log(err);
									});
								setRecordingOptionsModalVisible(false);
							}}
						>
							<Text style={styles.textStyle}>Share / Send</Text>
						</TouchableOpacity>
						<TouchableOpacity
							accessibilityRole="button"
							onPress={() => {
								setRecordingOptionsModalVisible(false);
								setRenameModalVisible(true);
							}}
						>
							<Text style={styles.textStyle}>Rename</Text>
						</TouchableOpacity>
						<TouchableOpacity
							accessibilityRole="button"
							onPress={() => {
								ReactNativeFileSystem.unlink(recording.path).catch(console.error);
								setRecordingOptionsModalVisible(false);
							}}
						>
							<Text style={styles.textStyle}>Delete</Text>
						</TouchableOpacity>
						<TouchableOpacity accessibilityRole="button">
							<Text style={styles.textStyle}>Set as</Text>
						</TouchableOpacity>
						<TouchableOpacity accessibilityRole="button">
							<Text style={styles.textStyle}>Open with</Text>
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
		fontWeight: "normal",
		textAlign: "left",
		fontSize: 16,
		margin: 2,
		padding: 2
	}
});
