/* eslint-disable react-hooks/exhaustive-deps */
import { CheckBox, MusicButton, RecordingOptionsModal } from "@/components";
import RecordingRenameModal from "@/components/RecordingRenameModal";
import { getRecordings, setRecordings } from "@/redux/recordingsReducer";
import { getSortMode } from "@/redux/sortModeReducer";
import store, { useAppDispatch, useAppSelector } from "@/redux/store";
import { getTheme } from "@/redux/themeReducer";
import { PermissionStatusMap, Recording, SortField, SortOrder } from "@/types";
import { formatBytes, RecordingsArray, sortRecordings } from "@/utilities";
import { AnimationType, useModal } from "@idiosync/react-native-modal";
import Slider from "@react-native-community/slider";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Provider } from "react-redux";

import type { PlayBackType } from "react-native-audio-recorder-player";
const delay = (ms: number) => new Promise((resolve) => setTimeout(() => resolve(null), ms));
// TODO: Debug player starting as soon as app opens
// TODO: code previous and next track functionality
// TODO: debug long pressing recording not updating check mark
// TODO: debug selecting recording sorting recordings every time
// TODO: debug selecting recording sorting recordings with same date
export default function Player({ permissionStatus }: { permissionStatus: PermissionStatusMap }) {
	const dispatch = useAppDispatch();
	const sortMode = useAppSelector(getSortMode);
	const recordings = useAppSelector(getRecordings);
	const screenWidth = useWindowDimensions().width;
	const audioRecorderPlayer = new AudioRecorderPlayer();
	const theme = useAppSelector(getTheme);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [volume, setVolume] = useState(50);
	const [seek, setSeek] = useState(0);
	const [duration, setDuration] = useState(0);
	const [recordingPath, setRecordingPath] = useState<string>("");
	const [currentRecording, setCurrentRecording] = useState<Recording>();
	const [recordingOptionsModalVisible, setRecordingOptionsModalVisible] = useState(false);
	const [renameModalVisible, setRenameModalVisible] = useState(false);
	useModal(
		{
			renderModal: () => (
				<RecordingOptionsModal
					theme={theme}
					recording={currentRecording!}
					setRecordingOptionsModalVisible={setRecordingOptionsModalVisible}
					setRenameModalVisible={setRenameModalVisible}
				/>
			),
			onBackgroundPress: () => setRecordingOptionsModalVisible(false),
			animationTypeIn: AnimationType.FADE,
			animationTimeIn: 250,
			animationTypeOut: AnimationType.FADE,
			animationTimeOut: 250
		},
		recordingOptionsModalVisible,
		[currentRecording]
	);
	useModal(
		{
			renderModal: () => (
				<Provider store={store}>
					<RecordingRenameModal theme={theme} recording={currentRecording!} setRenameModalVisible={setRenameModalVisible} />
				</Provider>
			),
			onBackgroundPress: () => setRenameModalVisible(false),
			animationTypeIn: AnimationType.FADE,
			animationTimeIn: 250,
			animationTypeOut: AnimationType.FADE,
			animationTimeOut: 250
		},
		renameModalVisible,
		[currentRecording]
	);
	const playBackListener = (data: PlayBackType) => {
		if (duration === 0) {
			setDuration(Math.floor(data.duration));
		}
		if (data.duration === data.currentPosition) {
			setSeek(0);
			setIsPlaying(false);
			setIsPaused(false);
		}
		setSeek(data.currentPosition);
	};
	useEffect(() => {
		(async () => {
			await audioRecorderPlayer.setSubscriptionDuration(0.1);
		})();
	}, []);
	useEffect(() => {
		audioRecorderPlayer.addPlayBackListener(playBackListener);

		return () => {
			(async () => {
				audioRecorderPlayer.removePlayBackListener();
				if (isPlaying) await audioRecorderPlayer.stopPlayer();
			})();
		};
	}, []);
	useEffect(() => {
		console.log(sortMode);
	}, [sortMode]);
	useEffect(() => {
		console.log(
			new Date().toLocaleString("en-US", {
				month: "short",
				day: "numeric",
				weekday: "short",
				year: "numeric",
				hour: "numeric",
				minute: "numeric",
				second: "numeric"
			}),
			JSON.stringify(recordings, undefined, 1)
		);
	}, [recordings]);
	// Use effect hook to handle volume change
	useEffect(() => {
		(async () => {
			await audioRecorderPlayer.setVolume(volume / 100);
		})();
	}, [volume]);

	useEffect(() => {
		if (recordings && sortMode) {
			const [sortField, sortOrder] = sortMode.split("-") as [SortField, SortOrder];
			const sortedRecordings = sortRecordings(new RecordingsArray(recordings), sortField, sortOrder);
			if (JSON.stringify(sortedRecordings) !== JSON.stringify(recordings)) {
				dispatch(setRecordings(sortedRecordings));
			}
		}
	}, [recordings, sortMode]);

	// useCallback hook to optimize the performance of togglePlayer
	const togglePlayer = useCallback(async () => {
		console.log("isPlaying", isPlaying);
		console.log("isPaused", isPaused);
		console.log("Isn't playing and paused", !isPlaying && !isPaused);
		console.log("Is playing and isn't paused", !isPlaying && !isPaused);
		console.log("Is paused and isn't playing", isPaused && !isPlaying);
		if (!isPlaying && !isPaused) await startPlayer();
		if (isPlaying && !isPaused) await pausePlayer();
		if (isPaused && !isPlaying) await resumePlayer();
	}, [isPlaying, isPaused]);
	async function startPlayer() {
		setIsPlaying(true);

		await audioRecorderPlayer.startPlayer(recordingPath);
	}
	async function resumePlayer() {
		audioRecorderPlayer.addPlayBackListener(playBackListener);
		await audioRecorderPlayer.resumePlayer();
		setIsPaused(false);
	}
	async function pausePlayer() {
		await audioRecorderPlayer.pausePlayer();
		audioRecorderPlayer.removePlayBackListener();
		setIsPaused(true);
		setIsPlaying(false);
	}
	function previousTrack() {
		if (recordings) {
			if (recordings.hasPrevious) {
				return setRecordingPath(recordings.previous?.path!);
			}
		}
	}
	function nextTrack() {
		if (recordings) {
			if (recordings.hasNext) {
				return setRecordingPath(recordings.next?.path!);
			}
		}
	}
	function setVolumeMin() {
		setVolume(0);
	}
	function setVolumeMax() {
		setVolume(100);
	}
	function onSeekChange(value: number) {
		(async () => {
			setSeek(value);
			await audioRecorderPlayer.seekToPlayer(value);
		})();
	}
	function onVolumeChange(value: number) {
		setVolume(value);
	}

	return (
		<View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
			{Array.from(Object.values(permissionStatus)).every((status) => status === "denied") ? (
				<Text style={{ color: theme.colors.text, fontSize: 20, textAlign: "center" }}>⚠️ Permissions denied ⚠️</Text>
			) : (
				<View style={{ alignItems: "center", justifyContent: "flex-start", width: "100%", height: "100%" }}>
					<View
						style={{
							flexDirection: "column",
							backgroundColor: theme.colors.card,
							borderRadius: 5,
							width: screenWidth - screenWidth / 32,
							padding: 15,
							margin: 8,
							justifyContent: "space-between"
						}}
					>
						<View
							style={{
								flexDirection: "row",
								backgroundColor: theme.colors.card,
								borderRadius: 5,
								justifyContent: "space-between",
								marginBottom: 8
							}}
						>
							<View style={{ flexDirection: "row" }}>
								<MusicButton style={{ padding: 0 }} onPress={previousTrack} disabled={!recordings.hasPrevious}>
									<MaterialCommunityIcons name="step-backward" color={theme.colors.text} size={24} />
								</MusicButton>
								<MusicButton style={{ padding: 0 }} onPress={togglePlayer}>
									<MaterialCommunityIcons name={isPlaying ? "stop" : "play"} color={theme.colors.text} size={24} />
								</MusicButton>
								<MusicButton style={{ padding: 0 }} onPress={nextTrack} disabled={!recordings.hasNext}>
									<MaterialCommunityIcons name="step-forward" color={theme.colors.text} size={24} />
								</MusicButton>
							</View>
							<View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4, marginBottom: 4 }}>
								<MusicButton style={{ padding: 0 }} onPress={setVolumeMin}>
									<MaterialCommunityIcons name="volume-low" color={theme.colors.text} size={24} />
								</MusicButton>
								<Slider minimumValue={0} maximumValue={100} value={volume} onSlidingComplete={onVolumeChange} style={styles.volumeBar} />
								<MusicButton style={{ padding: 0 }} onPress={setVolumeMax}>
									<MaterialCommunityIcons name="volume-high" color={theme.colors.text} size={24} />
								</MusicButton>
							</View>
						</View>
						<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
							<Text style={{ color: theme.colors.text }}>{audioRecorderPlayer.mmssss(seek)}</Text>
							<Slider minimumValue={0} maximumValue={duration} value={seek} onSlidingComplete={onSeekChange} style={styles.seekBar} />
							<Text style={{ color: theme.colors.text }}>{audioRecorderPlayer.mmssss(duration - seek)}</Text>
						</View>
					</View>
					<ScrollView>
						<View style={{ alignItems: "center", justifyContent: "center" }}>
							{recordings?.map((recording) => (
								<TouchableOpacity
									accessibilityRole="button"
									style={{
										alignItems: "center",
										justifyContent: "center",
										backgroundColor: theme.colors.card,
										padding: 20,
										borderRadius: 5,
										margin: 4,
										width: screenWidth - screenWidth / 16
									}}
									key={recording.name.substring(0, recording.name.lastIndexOf("."))}
									onPress={function () {
										setRecordingPath(recording.path);
										(async () => {
											await audioRecorderPlayer.stopPlayer();
										})();
										setDuration(0);
										setSeek(0);
										const index = recordings.findIndex((rec) => rec.path === recordingPath);
										if (index !== -1) {
											recordings.setCurrentIndex(index);
										}
										(async () => {
											delay(100);
											await audioRecorderPlayer.startPlayer(recordingPath);
										})();
									}}
									onLongPress={function () {
										if (recordings && sortMode) {
											const [sortField, sortOrder] = sortMode.split("-") as [SortField, SortOrder];
											dispatch(
												setRecordings(
													sortRecordings(
														new RecordingsArray([
															...recordings.filter((rec) => rec.path !== recording.path),
															{ ...recording, selected: !recording.selected }
														]),
														sortField,
														sortOrder
													)
												)
											);
										}
									}}
								>
									<View
										style={{
											flexDirection: "column"
										}}
									>
										<View
											style={{
												flexDirection: "row",
												justifyContent: "space-between",
												alignItems: "flex-start",
												width: "100%"
											}}
										>
											<CheckBox
												containerStyle={{ alignSelf: "flex-start" }}
												onPress={function () {
													if (recordings && sortMode) {
														const [sortField, sortOrder] = sortMode.split("-") as [SortField, SortOrder];
														dispatch(
															setRecordings(
																sortRecordings(
																	new RecordingsArray([
																		...recordings.filter((rec) => rec.path !== recording.path),
																		{ ...recording, selected: !recording.selected }
																	]),
																	sortField,
																	sortOrder
																)
															)
														);
													}
												}}
												checked={recording.selected}
											/>
											<Text style={{ flex: 1, flexWrap: "wrap", fontWeight: "bold", fontSize: 16, alignSelf: "flex-end" }}>
												{recording.name.substring(0, recording.name.lastIndexOf("."))}
											</Text>
											{
												<TouchableOpacity
													accessibilityRole="button"
													onPress={() => {
														setCurrentRecording(recording);
														setRecordingOptionsModalVisible(true);
													}}
												>
													<MaterialCommunityIcons name="dots-vertical" color={theme.colors.text} size={20} />
												</TouchableOpacity>
												// TODO: finish 3 dot menu modal functionality
											}
										</View>
										<View
											style={{
												flexDirection: "row",
												justifyContent: "space-between"
											}}
										>
											<Text style={{ backgroundColor: "#6B6B6B", borderRadius: 3, padding: 2, alignSelf: "flex-end", fontSize: 10 }}>
												{recording.name.slice(recording.name.lastIndexOf(".") + 1).toUpperCase()}
											</Text>
											<Text style={{ color: "grey", alignSelf: "flex-end" }}>
												{(recording.ctime
													? recording.ctime
														? new Date(recording.ctime)
														: new Date()
													: recording.mtime
													? new Date(recording.mtime)
													: new Date()
												).toLocaleString("en-US", {
													month: "short",
													day: "numeric",
													weekday: "short",
													year: "numeric",
													hour: "numeric",
													minute: "numeric"
												})}
											</Text>
											<Text style={{ color: "grey", alignSelf: "flex-end" }}>{formatBytes(recording.size, 1)}</Text>
										</View>
									</View>
								</TouchableOpacity>
							))}
						</View>
					</ScrollView>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	elapsedTime: {
		fontSize: 20
	},
	volumeBar: {
		width: 100,
		height: 20,
		alignSelf: "center"
	},
	seekBar: {
		width: "68%",
		height: 20,
		alignSelf: "center"
	}
});
