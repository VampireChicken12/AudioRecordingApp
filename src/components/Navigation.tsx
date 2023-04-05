import { getRecordings, setRecordings } from "@/redux/recordingsReducer";
import { getSortMode } from "@/redux/sortModeReducer";
import store, { useAppDispatch, useAppSelector } from "@/redux/store";
import { getTheme, ThemeState } from "@/redux/themeReducer";
import { Player, Recorder, Settings } from "@/screens";
import { PermissionStatusMap, SortField, SortOrder } from "@/types";
import { RecordingsArray, sortRecordings } from "@/utilities";
import { AnimationType } from "@idiosync/react-native-modal/lib/types";
import { useModal } from "@idiosync/react-native-modal/lib/use-modal";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TabBarTop from "@react-navigation/material-top-tabs/src/views/MaterialTopTabBar";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import ReactNativeFileSystem from "react-native-fs";
import Share from "react-native-share";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Provider } from "react-redux";

import Button from "./Button";
import SortModeModal from "./SortModeModal";
const Tab = createMaterialTopTabNavigator();
const TabBarIcon = ({
	icon,
	theme
}: {
	icon: "microphone" | "play" | "cog" | "share-variant" | "arrow-left" | "sort-variant" | "trash-can";
	theme: ThemeState;
}) => {
	return <MaterialCommunityIcons name={icon} size={24} color={theme.colors.text} />;
};
export default function Navigation({ permissionStatus }: { permissionStatus: PermissionStatusMap }) {
	const dispatch = useAppDispatch();
	const recordings = useAppSelector(getRecordings);
	const theme = useAppSelector(getTheme);
	const sortMode = useAppSelector(getSortMode);
	const [showRecordingOptions, setShowRecordingOptions] = useState(false);
	const [sortModeModalVisible, setSortModeModalVisible] = useState(false);
	useEffect(() => {
		if (recordings.filter((recording) => recording.selected).length > 0) {
			setShowRecordingOptions(true);
		} else {
			setShowRecordingOptions(false);
		}
	}, [recordings]);
	useModal(
		{
			renderModal: () => (
				<Provider store={store}>
					<SortModeModal theme={theme} />
				</Provider>
			),
			onBackgroundPress: () => setSortModeModalVisible(false),
			animationTypeIn: AnimationType.FADE,
			animationTimeIn: 250,
			animationTypeOut: AnimationType.FADE,
			animationTimeOut: 250
		},
		sortModeModalVisible,
		[]
	);
	return (
		<NavigationContainer theme={theme}>
			<Tab.Navigator
				initialRouteName="Recorder"
				screenOptions={{
					tabBarActiveTintColor: theme.colors.text,
					tabBarLabelStyle: { fontSize: 20 },
					tabBarStyle: {
						backgroundColor: theme.colors.card,
						elevation: 0
					}
				}}
				tabBar={(props) => {
					const { state } = props;
					const label = state.routes[state.index]?.name;
					return (
						<View style={{ backgroundColor: theme.colors.card }}>
							<View style={{ flexDirection: "row", justifyContent: "space-between", height: 41 }}>
								{label === "Player" ? (
									<>
										{showRecordingOptions && (
											<>
												<View style={{ flexDirection: "row", alignItems: "center" }}>
													<Button
														IconComponent={() => <TabBarIcon icon="arrow-left" theme={theme} />}
														title=""
														onPress={() => {
															// TODO: debug pressing back button not unchecking recordings
															dispatch(setRecordings(new RecordingsArray(recordings.map((recording) => ({ ...recording, selected: false })))));
														}}
														style={{ backgroundColor: "transparent", padding: 0, margin: 0, paddingLeft: 12 }}
													/>
													<Text style={{ padding: 0, margin: 0, paddingLeft: 12, fontSize: 20, fontWeight: "bold" }}>
														{recordings.filter((recording) => recording.selected).length}
													</Text>
												</View>
												<View style={{ flexDirection: "row", alignItems: "center" }}>
													<Button
														IconComponent={() => <TabBarIcon icon="share-variant" theme={theme} />}
														title=""
														onPress={function () {
															Share.open({
																urls: recordings.filter((recording) => recording.selected).map((recording) => `file://${recording.path}`)
															})
																.then((res) => {
																	console.log(res);
																	const [sortField, sortOrder] = sortMode.split("-") as [SortField, SortOrder];
																	dispatch(
																		setRecordings(
																			sortRecordings(new RecordingsArray(recordings.filter((recording) => !recording.selected)), sortField, sortOrder)
																		)
																	);
																})
																.catch((err) => {
																	err && console.log(err);
																});
														}}
														style={{ backgroundColor: "transparent", padding: 0, margin: 0, paddingRight: 12 }}
													/>
													<Button
														IconComponent={() => <TabBarIcon icon="trash-can" theme={theme} />}
														title=""
														onPress={function () {
															(async () => {
																await Promise.all(
																	recordings
																		.filter((recording) => recording.selected)
																		.map(async (recording) => {
																			try {
																				return await ReactNativeFileSystem.unlink(recording.path);
																			} catch (error) {
																				return console.error(error);
																			}
																		})
																).catch((error) => console.error(error));

																const [sortField, sortOrder] = sortMode.split("-") as [SortField, SortOrder];
																dispatch(
																	setRecordings(
																		sortRecordings(new RecordingsArray(recordings.filter((recording) => !recording.selected)), sortField, sortOrder)
																	)
																);
															})();
														}}
														style={{ backgroundColor: "transparent", padding: 0, margin: 0, paddingRight: 12 }}
													/>
												</View>
											</>
										)}
										{!showRecordingOptions && (
											<>
												<Text style={{ color: theme.colors.text, paddingLeft: 12, paddingTop: 11, fontWeight: "bold" }}>{label}</Text>
												<Button
													IconComponent={() => <TabBarIcon icon="sort-variant" theme={theme} />}
													title=""
													onPress={() => setSortModeModalVisible(!sortModeModalVisible)}
													style={{ backgroundColor: "transparent", padding: 0, margin: 0, paddingRight: 12, paddingTop: 1 }}
												/>
											</>
										)}
									</>
								) : (
									<Text style={{ color: theme.colors.text, paddingLeft: 12, paddingTop: 11, fontWeight: "bold" }}>{label}</Text>
								)}
							</View>
							<TabBarTop {...props} />
						</View>
					);
				}}
			>
				<Tab.Screen
					name="Recorder"
					options={{
						tabBarShowLabel: false,
						tabBarIcon: () => <TabBarIcon icon="microphone" theme={theme} />
					}}
				>
					{() => <Recorder permissionStatus={permissionStatus} />}
				</Tab.Screen>
				<Tab.Screen
					name="Player"
					options={{
						tabBarShowLabel: false,
						tabBarIcon: () => <TabBarIcon icon="play" theme={theme} />
					}}
				>
					{() => (
						<Provider store={store}>
							<Player permissionStatus={permissionStatus} />
						</Provider>
					)}
				</Tab.Screen>
				<Tab.Screen
					name="Settings"
					options={{
						tabBarShowLabel: false,
						tabBarIcon: () => <TabBarIcon icon="cog" theme={theme} />
					}}
				>
					{() => <Settings _permissionStatus={permissionStatus} />}
				</Tab.Screen>
			</Tab.Navigator>
		</NavigationContainer>
	);
}
