/* eslint-disable react-hooks/exhaustive-deps */
import { SettingsModal, SettingsRow } from "@/components";
import { getSettings, setSettings, TSettings } from "@/redux/settingsReducer";
import store, { useAppDispatch, useAppSelector } from "@/redux/store";
import { PermissionStatusMap, SettingRow } from "@/types";
import { formatBytes, mergeChanges } from "@/utilities";
import { storage } from "@/utilities/storage";
import { AnimationType, useModal } from "@idiosync/react-native-modal";
import React, { useEffect, useRef, useState } from "react";
import { AppState, ScrollView } from "react-native";
import ReactNativeFileSystem from "react-native-fs";
import { Provider } from "react-redux";

export default function Settings({ _permissionStatus }: { _permissionStatus: PermissionStatusMap }) {
	const dispatch = useAppDispatch();
	const settings = useAppSelector(getSettings);
	const appState = useRef(AppState.currentState);
	const [currentSetting, setCurrentSetting] = useState<[keyof TSettings, SettingRow]>(Object.entries(settings)[0] as [keyof TSettings, SettingRow]);
	const [settingModalVisible, setSettingModalVisible] = useState(false);
	useEffect(() => {
		const subscription = AppState.addEventListener("change", (nextAppState) => {
			if (appState.current.match(/inactive|background/) && nextAppState === "active") {
				ReactNativeFileSystem.getFSInfo().then(({ freeSpace, totalSpace }) => {
					dispatch(
						setSettings(
							mergeChanges(settings, {
								availableStorage: `${formatBytes(freeSpace)} of ${formatBytes(totalSpace, 2)} (${Math.round((freeSpace / totalSpace) * 100)}%)`
							})
						)
					);
				});
			}
		});

		return () => {
			subscription.remove();
		};
	}, []);
	useEffect(() => {
		Object.entries(settings).forEach(async ([settingKey, setting]) => {
			storage.set(settingKey, JSON.stringify(setting));
		});
	}, [settings]);
	useEffect(() => {
		ReactNativeFileSystem.getFSInfo().then(({ freeSpace, totalSpace }) => {
			dispatch(
				setSettings(
					mergeChanges(settings, {
						availableStorage: `${formatBytes(freeSpace, 2)} of ${formatBytes(totalSpace, 2)} (${Math.round((freeSpace / totalSpace) * 100)}%)`
					})
				)
			);
		});
	}, []);
	useModal(
		{
			renderModal: () => (
				<Provider store={store}>
					<SettingsModal setting={currentSetting} setSettingModalVisible={setSettingModalVisible} settings={settings} setSettings={setSettings} />
				</Provider>
			),
			onBackgroundPress: () => setSettingModalVisible(false),
			animationTypeIn: AnimationType.FADE,
			animationTimeIn: 250,
			animationTypeOut: AnimationType.FADE,
			animationTimeOut: 250
		},
		settingModalVisible,
		[currentSetting]
	);

	return (
		<ScrollView>
			{Object.entries(settings)
				.sort(([, a], [, b]) => a.weight - b.weight)
				.map(([settingKey, setting]) => {
					return (
						<SettingsRow
							setting={[settingKey, setting]}
							settings={settings}
							setSettingModalVisible={setSettingModalVisible}
							setCurrentSetting={setCurrentSetting}
							setSettings={setSettings}
							key={settingKey}
						/>
					);
				})}
		</ScrollView>
	);
}
