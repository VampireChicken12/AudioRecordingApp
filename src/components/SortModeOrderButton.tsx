import { setSortMode } from "@/redux/sortModeReducer";
import { SortMode } from "@/types";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useAppDispatch } from "../redux/store";
import { ThemeState } from "../redux/themeReducer";
import { SortOrder } from "../types";

export default function SortModeOrderButton({
	theme,
	disabled,
	label,
	sortMode,
	sortOrder
}: {
	disabled: boolean;
	label: string;
	theme: ThemeState;
	sortMode: SortMode;
	sortOrder: SortOrder;
}) {
	const dispatch = useAppDispatch();
	return (
		<TouchableOpacity
			accessibilityRole="button"
			style={{ flexDirection: "row", padding: 2, margin: 2, alignItems: "center", marginLeft: "-22%" }}
			onPress={() => {
				dispatch(setSortMode(sortMode));
			}}
		>
			<MaterialCommunityIcons name={sortOrder === "asc" ? "arrow-up" : "arrow-down"} size={20} color={disabled ? "#6B6B6B" : theme.colors.text} />
			<Text style={{ color: disabled ? "#6B6B6B" : theme.colors.text, marginLeft: 12, fontSize: 18 }}>{label}</Text>
		</TouchableOpacity>
	);
}
