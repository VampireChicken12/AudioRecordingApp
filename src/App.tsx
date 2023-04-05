import MainComponent from "@/components/MainComponent";
import { PermissionStatusMap } from "@/types";
import { ModalContextLayer } from "@idiosync/react-native-modal";
import React, { useEffect, useState } from "react";
import Permissions from "react-native-permissions";
import { Provider } from "react-redux";

import store from "./redux/store";

// TODO: re-work light theme colors for card and background color
const App = () => {
	const [permissionStatus, setPermissionStatus] = useState<PermissionStatusMap>({
		"android.permission.RECORD_AUDIO": "undetermined",
		"android.permission.READ_EXTERNAL_STORAGE": "undetermined",
		"android.permission.WRITE_EXTERNAL_STORAGE": "undetermined"
	});
	useEffect(() => {
		Permissions.checkMultiple([
			"android.permission.RECORD_AUDIO",
			"android.permission.READ_EXTERNAL_STORAGE",
			"android.permission.WRITE_EXTERNAL_STORAGE"
		])
			.then((response) => {
				if (Array.from(Object.values(response)).every((status) => status === "denied")) {
					Permissions.requestMultiple([
						"android.permission.RECORD_AUDIO",
						"android.permission.READ_EXTERNAL_STORAGE",
						"android.permission.WRITE_EXTERNAL_STORAGE"
					])
						.then((res) => {
							setPermissionStatus(res as unknown as PermissionStatusMap);
						})
						.catch((error) => {
							console.error(error);
						});
				} else {
					if (JSON.stringify(response) !== JSON.stringify(permissionStatus)) {
						setPermissionStatus(response as unknown as PermissionStatusMap);
					}
					return;
				}
			})
			.catch((error) => {
				console.error(error);
			});

		// Permissions.requestNotifications(["alert", "badge"]);
	}, [permissionStatus]);
	useEffect(() => {
		if (Array.from(Object.entries(permissionStatus)).filter(([, value]) => value === "denied").length > 0) {
			Permissions.requestMultiple([
				...Array.from(Object.entries(permissionStatus))
					.filter(([, value]) => value === "denied")
					.map(([key]) => key)
			])
				.then((response) => {
					setPermissionStatus(response as unknown as PermissionStatusMap);
				})
				.catch((error) => {
					console.error(error);
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<ModalContextLayer>
			<Provider store={store}>
				<MainComponent permissionStatus={permissionStatus} />
			</Provider>
		</ModalContextLayer>
	);
};

export default App;
