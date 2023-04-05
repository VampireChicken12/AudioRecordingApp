import { setSettings as setSettingsRedux, TSettings } from "@/redux/settingsReducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getTheme } from "@/redux/themeReducer";
import { SettingRow, SettingsBase } from "@/types";
import { mergeChanges } from "@/utilities";
import React, { Dispatch, SetStateAction } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function SettingsRow({
	setting: [settingKey, setting],
	settings,
	setSettingModalVisible,
	setCurrentSetting,
	setSettings
}: {
	setting: [keyof TSettings, SettingRow];
	setSettingModalVisible: Dispatch<SetStateAction<boolean>>;
	settings: SettingsBase;
	setCurrentSetting: Dispatch<SetStateAction<[keyof TSettings, SettingRow]>>;
	setSettings: typeof setSettingsRedux;
}) {
	const theme = useAppSelector(getTheme);
	const dispatch = useAppDispatch();
	const { type } = setting;

	// TODO: implement icon into these
	switch (type) {
		case "list": {
			const { labels, title, value, values } = setting;
			return (
				<View style={{ flexDirection: "column", padding: 10, margin: 4, alignSelf: "stretch" }}>
					<TouchableOpacity
						onPress={() => {
							setCurrentSetting([settingKey, setting]);
							setSettingModalVisible(true);
						}}
					>
						<Text style={[styles.textStyle, styles.title]}>{title}</Text>
						<Text style={[styles.textStyle, styles.description]}>{labels[values.findIndex((e) => e === value)]}</Text>
					</TouchableOpacity>
				</View>
			);
		}
		case "details": {
			const { details, title } = setting;
			return (
				<View style={{ flexDirection: "column", padding: 10, margin: 4, alignSelf: "stretch" }}>
					<Text style={[styles.textStyle, styles.title]}>{title}</Text>
					<Text style={[styles.textStyle, styles.description]}>{details}</Text>
				</View>
			);
		}
		case "switch": {
			const { title, value, description } = setting;
			return (
				<TouchableOpacity
					onPress={() => {
						dispatch(setSettings(mergeChanges(settings, { [settingKey]: !value }) as TSettings));
					}}
					style={{ flexDirection: "row", padding: 10, margin: 4, alignSelf: "stretch" }}
				>
					<View style={{ flexDirection: "column", alignSelf: "stretch", width: "100%" }}>
						<Text style={[styles.textStyle, styles.title]}>{title}</Text>
						{description && <Text style={[styles.textStyle, styles.description]}>{description}</Text>}
					</View>
					<MaterialCommunityIcons
						name={value ? "toggle-switch" : "toggle-switch-off"}
						color={theme.colors.text}
						size={40}
						style={{ marginLeft: "-15%" }}
					/>
				</TouchableOpacity>
			);
		}
	}
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
	},
	title: {
		fontSize: 16,
		fontWeight: "900",
		textAlign: "left",
		marginLeft: "7.5%"
	},
	description: { fontSize: 14, fontWeight: "200", textAlign: "left", marginLeft: "8%" }
});
