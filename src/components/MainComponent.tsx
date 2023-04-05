import { getRecordings, setRecordings } from "@/redux/recordingsReducer";
import { getSortMode } from "@/redux/sortModeReducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setTheme } from "@/redux/themeReducer";
import { PermissionStatusMap, Recording, SortField, SortOrder } from "@/types";
import { RecordingsArray, sortRecordings } from "@/utilities";
import { DefaultTheme } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Appearance, AppState, NativeEventSubscription } from "react-native";
import ReactNativeFileSystem from "react-native-fs";

import Navigation from "./Navigation";

function colorSchemeFalsy(colorScheme: any) {
	if (["dark", "light"].includes(colorScheme)) return true;
	else return false;
}

export default function MainComponent({ permissionStatus }: { permissionStatus: PermissionStatusMap }) {
	const themeChange = useRef<NativeEventSubscription | null>(null);
	const sortMode = useAppSelector(getSortMode);
	const dispatch = useAppDispatch();
	const recordings = useAppSelector(getRecordings);
	const appState = useRef(AppState.currentState);
	const [appStateVisible, setAppStateVisible] = useState(appState.current);
	useEffect(() => {
		const recordingsInterval = setInterval(() => {
			(async () => {
				try {
					const [sortField, sortOrder] = sortMode.split("-") as [SortField, SortOrder];
					const dirRecordings = await ReactNativeFileSystem.readDir(ReactNativeFileSystem.ExternalDirectoryPath + "/Recordings");
					const sortedDirRecordings = sortRecordings(
						new RecordingsArray(
							dirRecordings
								.map((i) => ({ ...i, selected: recordings.find((r) => r.path === i.path)?.selected || false }))
								.map((i) => {
									const recording = { ...i, mtime: i.mtime ? i.mtime.toString() : i.mtime };
									(["isFile", "isDirectory"] as const).forEach((item) => delete recording[item]);
									return recording;
								}) as Recording[]
						),
						sortField,
						sortOrder
					);
					const hasNewRecordings = JSON.stringify(recordings) !== JSON.stringify(sortedDirRecordings);
					if (hasNewRecordings) {
						dispatch(setRecordings(sortedDirRecordings));
					}
				} catch (error) {
					console.error(error);
				}
			})();
		}, 1000);
		return () => {
			if (recordingsInterval) {
				clearInterval(recordingsInterval);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [recordings]);

	useEffect(() => {
		const subscription = AppState.addEventListener("change", (nextAppState) => {
			if (appState.current.match(/inactive|background/) && nextAppState === "active") {
				console.log("App has come to the foreground!");
			}

			appState.current = nextAppState;
			setAppStateVisible(appState.current);
		});

		return () => {
			subscription.remove();
		};
	}, []);
	useEffect(() => {
		const userColorScheme = Appearance.getColorScheme();
		dispatch(
			setTheme({
				...DefaultTheme,
				colors: {
					...DefaultTheme.colors,
					text: colorSchemeFalsy(userColorScheme) ? (userColorScheme === "dark" ? "#FFFFFF" : "#000000") : "#000000",
					background: colorSchemeFalsy(userColorScheme) ? (userColorScheme === "dark" ? "#303030" : "#FFFFFF") : "#303030",
					card: colorSchemeFalsy(userColorScheme) ? (userColorScheme === "dark" ? "#181A1B" : "#FCFCFC") : "#181A1B"
				}
			})
		);
		themeChange.current = Appearance.addChangeListener(onThemeChange);

		return () => (themeChange.current ? themeChange.current.remove() : undefined);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onThemeChange = ({ colorScheme }: { colorScheme: "light" | "dark" | null | undefined }) => {
		dispatch(
			setTheme({
				...DefaultTheme,
				colors: {
					...DefaultTheme.colors,
					text: colorSchemeFalsy(colorScheme) ? (colorScheme === "dark" ? "#FFFFFF" : "#000000") : "#000000",
					background: colorSchemeFalsy(colorScheme) ? (colorScheme === "dark" ? "#303030" : "#FFFFFF") : "#303030",
					card: colorSchemeFalsy(colorScheme) ? (colorScheme === "dark" ? "#181A1B" : "#FFFFFF") : "#181A1B"
				}
			})
		);
	};
	useEffect(() => {
		ReactNativeFileSystem.exists(ReactNativeFileSystem.ExternalDirectoryPath + "/Recordings").then((exists) => {
			if (!exists) ReactNativeFileSystem.mkdir(ReactNativeFileSystem.ExternalDirectoryPath + "/Recordings");
		});

		ReactNativeFileSystem.readDir(ReactNativeFileSystem.ExternalDirectoryPath + "/Recordings").then((dirRecordings) => {
			const [sortField, sortOrder] = sortMode.split("-") as [SortField, SortOrder];
			dispatch(
				setRecordings(
					sortRecordings(
						new RecordingsArray(
							dirRecordings
								.map((i) => ({ ...i, selected: false }))
								.map((i) => {
									const recording = { ...i, mtime: i.mtime ? i.mtime.toString() : i.mtime };
									(["isFile", "isDirectory"] as const).forEach((item) => delete recording[item]);
									return recording;
								}) as Recording[]
						),
						sortField,
						sortOrder
					)
				)
			);
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return <Navigation permissionStatus={permissionStatus} />;
}
