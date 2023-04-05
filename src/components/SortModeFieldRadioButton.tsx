import { setSortMode } from "@/redux/sortModeReducer";
import { SortMode } from "@/types";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useAppDispatch } from "../redux/store";
import { ThemeState } from "../redux/themeReducer";

export default function SortModeFieldRadioButton({
	theme,
	checked,
	label,
	sortMode
}: {
	checked: boolean;
	label: string;
	theme: ThemeState;
	sortMode: SortMode;
}) {
	const dispatch = useAppDispatch();
	return (
		<TouchableOpacity
			accessibilityRole="button"
			style={{ flexDirection: "row", padding: 2, margin: 2, alignItems: "center", marginLeft: "-50%" }}
			onPress={() => dispatch(setSortMode(sortMode))}
		>
			<MaterialCommunityIcons name={checked ? "radiobox-marked" : "radiobox-blank"} size={20} color={theme.colors.text} />
			<Text style={{ color: theme.colors.text, marginLeft: 12, fontSize: 18 }}>{label}</Text>
		</TouchableOpacity>
	);
}
