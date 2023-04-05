import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getTheme, ThemeState } from "@/redux/themeReducer";
import { SettingRow, SettingsBase } from "@/types";
import React, { Dispatch, SetStateAction } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import mergeChanges from "../utilities/mergeChanges";
import { TSettings, setSettings as setSettingsRedux } from "@/redux/settingsReducer";

export default function SettingsModal({
	setting: [settingKey, setting],
	setSettingModalVisible,
	settings,
	setSettings
}: {
	setting: [keyof TSettings, SettingRow];
	setSettingModalVisible: Dispatch<SetStateAction<boolean>>;
	settings: SettingsBase;
	setSettings: typeof setSettingsRedux;
}) {
	const theme = useAppSelector(getTheme);
	const dispatch = useAppDispatch();
	if (setting.type === "list") {
		const { labels, title, value, values } = setting;
		return (
			<View style={styles.centeredView}>
				<View style={[styles.modalView, { backgroundColor: "#424242" }]}>
					<Text
						style={[
							{
								color: theme.colors.text,
								fontWeight: "bold",
								fontSize: 18,
								marginTop: 4,
								marginBottom: 4
							}
						]}
					>
						{title}
					</Text>
					<View style={{ flexDirection: "column", flex: 1 }}>
						{labels.map((label, index) => (
							<RadioButton
								checked={values[index] === value}
								label={label}
								theme={theme}
								onPress={() => {
									dispatch(setSettings(mergeChanges(settings, { [settingKey]: values[index] }) as TSettings));
									setSettingModalVisible(false);
								}}
								key={value + label}
							/>
						))}
					</View>
					<View style={{ flexDirection: "row", flex: 1, alignSelf: "flex-end", marginTop: 2, marginBottom: 0 }}>
						<TouchableOpacity
							accessibilityRole="button"
							onPress={async () => {
								setSettingModalVisible(false);
							}}
							style={{ flex: 1 }}
						>
							<Text style={styles.textStyle}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
	return null;
}
function RadioButton({ theme, checked, label, onPress }: { checked: boolean; label: string; theme: ThemeState; onPress: () => void }) {
	return (
		<TouchableOpacity accessibilityRole="button" style={{ flexDirection: "row", padding: 2, margin: 2, alignItems: "center" }} onPress={onPress}>
			<MaterialCommunityIcons name={checked ? "radiobox-marked" : "radiobox-blank"} size={20} color={theme.colors.text} />
			<Text style={{ color: theme.colors.text, marginLeft: 12, fontSize: 18 }}>{label}</Text>
		</TouchableOpacity>
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
