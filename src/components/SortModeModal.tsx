import { useAppSelector } from "@/redux/store";
import { ThemeState } from "@/redux/themeReducer";
import { SortField, sortFields, SortMode, SortOrder, sortOrders } from "@/types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import capitalize from "../utilities/capitalize";
import SortModeFieldRadioButton from "./SortModeFieldRadioButton";
import SortModeOrderButton from "./SortModeOrderButton";
import { getSortMode } from "@/redux/sortModeReducer";

export default function SortModeModal({ theme }: { theme: ThemeState }) {
	const sortMode = useAppSelector(getSortMode);
	return (
		<View style={styles.centeredView}>
			<View style={[styles.modalView, { backgroundColor: theme.colors.card }]}>
				<Text style={[{ color: theme.colors.text, fontWeight: "bold", fontSize: 20, marginBottom: 8 }]}>Sort recordings by</Text>
				<View style={{ flexDirection: "column", flex: 1 }}>
					{sortFields.map((mode) => {
						return (
							<SortModeFieldRadioButton
								label={capitalize(mode)}
								checked={(sortMode.split("-")[0] as SortField) === mode}
								theme={theme}
								key={mode}
								sortMode={(mode + "-" + (sortMode.split("-")[1] as SortOrder)) as SortMode}
							/>
						);
					})}
				</View>
				<View style={{ flexDirection: "column", flex: 1 }}>
					{sortOrders.map((order) => {
						return (
							<SortModeOrderButton
								label={capitalize(order) + "ending"}
								disabled={(sortMode.split("-")[1] as SortOrder) === order}
								theme={theme}
								key={order}
								sortMode={((sortMode.split("-")[0] as SortField) + "-" + order) as SortMode}
								sortOrder={order}
							/>
						);
					})}
				</View>
			</View>
		</View>
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
		textAlign: "center"
	}
});
