import { useAppSelector } from "@/redux/store";
import { getTheme } from "@/redux/themeReducer";
import { Style } from "@/types";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface Props {
	label?: string;
	checked?: boolean;
	containerStyle?: Style;
	labelStyle?: Style;
	checkboxStyle?: Style;
	onPress: (checked: boolean) => void;
}
const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 10
	},
	checkbox: {
		width: 20,
		height: 20,
		alignItems: "center",
		justifyContent: "center"
	},
	label: {
		marginLeft: 10
	}
});
export default function CheckBox({ label, checked = false, containerStyle, labelStyle, checkboxStyle, onPress }: Props) {
	const theme = useAppSelector(getTheme);
	const [isChecked, setChecked] = useState(checked);

	const toggleCheckbox = () => {
		setChecked(!isChecked);
		onPress && onPress(!isChecked);
	};

	return (
		<View style={[styles.container, containerStyle]}>
			<TouchableOpacity accessibilityRole="button" style={[styles.checkbox, checkboxStyle]} onPress={toggleCheckbox}>
				<MaterialCommunityIcons name={isChecked ? "checkbox-marked" : "checkbox-blank-outline"} color={theme.colors.text} size={20} />
			</TouchableOpacity>
			{label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
		</View>
	);
}
