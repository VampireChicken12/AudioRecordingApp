/* eslint-disable react-hooks/exhaustive-deps */
import { PauseIcon, PlayIcon, RecIcon, StopIcon } from "@/icons";
import { useAppSelector } from "@/redux/store";
import { getTheme } from "@/redux/themeReducer";
import { PermissionStatusMap } from "@/types";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import AudioRecorderPlayer, {
	AudioEncoderAndroidType,
	AudioSet,
	AudioSourceAndroidType,
	OutputFormatAndroidType
} from "react-native-audio-recorder-player";
import ReactNativeFileSystem, { mkdir } from "react-native-fs";

import Button from "../components/Button";

type SamplingRate = 8000 | 11025 | 16000 | 22050 | 32000 | 44100 | 48000;
type Bitrate = 320000 | 256000 | 192000 | 128000 | 96000 | 64000 | 48000 | 32000;
export const BitrateLookup = {
	320000: "320kbps",
	256000: "256kbps",
	192000: "192kbps",
	128000: "128kbps",
	96000: "96kbps",
	64000: "64kbps",
	48000: "48kbps",
	32000: "32kbps"
} as const;
export const SamplingRateLookup = {
	8000: "8kHz",
	11025: "11kHz",
	16000: "16kHz",
	22050: "22kHz",
	32000: "32kHz",
	44100: "44kHz",
	48000: "48kHz"
} as const;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	elapsedTime: {
		fontSize: 20
	}
});

// TODO: code utilizing saved settings in recorder
export default function Recorder({ permissionStatus }: { permissionStatus: PermissionStatusMap }) {
	const {
		"android.permission.READ_EXTERNAL_STORAGE": readExternalStorage,
		"android.permission.RECORD_AUDIO": recordAudio,
		"android.permission.WRITE_EXTERNAL_STORAGE": writeExternalStorage
	} = permissionStatus;
	const theme = useAppSelector(getTheme);
	const audioRecorderPlayer = new AudioRecorderPlayer();
	audioRecorderPlayer.setSubscriptionDuration(0.05);

	const [duration, setDuration] = useState(0);
	const [isRecording, setIsRecording] = useState(false);
	const [isRecordingPaused, setIsRecordingPaused] = useState(false);
	const recordingPath = `${ReactNativeFileSystem.ExternalDirectoryPath + "/Recordings"}`;
	useEffect(() => {
		ReactNativeFileSystem.exists(recordingPath).then((exists) => {
			if (!exists) {
				try {
					mkdir(recordingPath);
				} catch (error) {
					console.error("Error creating recordings directory", error);
				}
			}
		});
	}, []);
	useEffect(() => {
		audioRecorderPlayer.addRecordBackListener((data) => {
			setDuration(Math.floor(data.currentPosition));
		});

		return () => {
			audioRecorderPlayer.removeRecordBackListener();
		};
	}, []);

	async function startRecord() {
		if (Platform.OS === "android") {
			try {
				if ([writeExternalStorage, readExternalStorage, recordAudio].every((status) => status === "granted")) {
					const audioSet: AudioSet = {
						AudioEncoderAndroid: AudioEncoderAndroidType.DEFAULT,
						AudioSourceAndroid: AudioSourceAndroidType.DEFAULT,
						OutputFormatAndroid: OutputFormatAndroidType.DEFAULT,
						AudioSamplingRateAndroid: 48000 as SamplingRate,
						AudioEncodingBitRateAndroid: 128000 as Bitrate
					};
					const path = `${recordingPath}/recording-${new Date()
						.toLocaleString("en-US", {
							year: "numeric",
							month: "numeric",
							day: "numeric",
							hour: "numeric",
							minute: "numeric",
							second: "numeric"
						})
						.replace(", ", "-")
						.replace(/ /g, "")
						.replace(/\//g, "_")
						.replace(/:/g, "_")}.mp4`;
					console.log(path);
					console.log(audioSet);
					const result = await audioRecorderPlayer.startRecorder("DEFAULT", undefined, true);
					// const result = await audioRecorderPlayer.startRecorder(path, undefined, true);
					// const result = await audioRecorderPlayer.startRecorder(path, audioSet, true);
					setIsRecording(true);
					console.log(result);
				} else {
					throw new Error("Permission denied");
				}
			} catch (err) {
				console.error(err);
				return;
			}
		}
	}
	async function pauseRecord() {
		const result = await audioRecorderPlayer.pauseRecorder();
		console.log(result);
		setIsRecording(false);
		setIsRecordingPaused(true);
	}
	async function resumeRecord() {
		const result = await audioRecorderPlayer.resumeRecorder();
		// audioRecorderPlayer.removeRecordBackListener();
		console.log(result);
		setIsRecording(true);
		setIsRecordingPaused(false);
	}
	async function stopRecord() {
		const result = await audioRecorderPlayer.stopRecorder();
		// audioRecorderPlayer.removeRecordBackListener();
		setIsRecording(false);
		setIsRecordingPaused(false);
		console.log(result);
	}
	return (
		<View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
			{Array.from(Object.values(permissionStatus)).every((status) => status === "denied") ? (
				<Text style={{ color: theme.colors.text, fontSize: 20, textAlign: "center" }}>⚠️ Permissions denied ⚠️</Text>
			) : (
				<View style={{ alignItems: "center", justifyContent: "center" }}>
					<Text style={{ ...styles.elapsedTime, color: theme.colors.text, paddingBottom: 4 }}>{audioRecorderPlayer.mmssss(duration)}</Text>
					<View style={{ flexDirection: "row" }}>
						<Button
							title="Record"
							onPress={startRecord}
							disabled={isRecording}
							IconComponent={() => <RecIcon color={theme.colors.text} />}
							style={{ backgroundColor: theme.colors.primary }}
						/>
						<Button
							title="Pause"
							onPress={pauseRecord}
							disabled={!isRecording ?? isRecordingPaused}
							IconComponent={() => <PauseIcon color={theme.colors.text} />}
							style={{ backgroundColor: theme.colors.primary }}
						/>
						<Button
							title="Resume"
							onPress={resumeRecord}
							disabled={!isRecordingPaused}
							IconComponent={() => <PlayIcon color={theme.colors.text} />}
							style={{ backgroundColor: theme.colors.primary }}
						/>
						<Button
							title="Stop"
							onPress={stopRecord}
							disabled={!isRecording}
							IconComponent={() => <StopIcon color={theme.colors.text} />}
							style={{ backgroundColor: theme.colors.primary }}
						/>
					</View>
				</View>
			)}
		</View>
	);
}
