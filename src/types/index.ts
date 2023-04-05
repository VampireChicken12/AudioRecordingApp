import { ColorValue, ImageStyle, ProcessedColorValue, TextStyle, ViewStyle } from "react-native";
import { ReadDirItem } from "react-native-fs";

export type PermissionStatus = "blocked" | "denied" | "granted" | "limited" | "undetermined";
export type PermissionStatusMap = {
	"android.permission.RECORD_AUDIO": PermissionStatus;
	"android.permission.READ_EXTERNAL_STORAGE": PermissionStatus;
	"android.permission.WRITE_EXTERNAL_STORAGE": PermissionStatus;
};

export type Recording = Exclude<ReadDirItem, "mtime" | "isFile" | "isDirectory"> & { selected: boolean } & { mtime: string | undefined };

declare global {
	interface ObjectConstructor {
		keys<T>(o: T): (keyof T)[];
		entries<T>(o: { [K in keyof T]: T[K] }): [keyof T, T[keyof T]][];
	}
}
export type Style = ViewStyle | TextStyle | ImageStyle;
export type FontIcon = {
	font: string;
	char: number;
	fg?: number | ColorValue;
	bg?: number | ColorValue;
	/** For internal use. */
	fgP?: ProcessedColorValue | null;
	/** For internal use. */
	bgP?: ProcessedColorValue | null;
};
export type DetailsRow = {
	title: string;
	type: "details";
	details: string;
	icon?: FontIcon;
	weight: number;
};
export type ListSetting = {
	value: string;
	title: string;
	type: "list";
	labels: ReadonlyArray<string>;
	values: ReadonlyArray<string>;
	icon?: FontIcon;
	weight: number;
};
export type SwitchSetting = {
	value: boolean;
	title: string;
	type: "switch";
	description?: string;
	icon?: FontIcon;
	weight: number;
};
export type SettingRow = DetailsRow | ListSetting | SwitchSetting;
export type SettingsBase = Record<string, SettingRow>;
export type SettingsResultStrict<Settings extends SettingsBase> = {
	[key in keyof Settings]: Settings[key]["type"] extends "switch" ? boolean : Settings[key]["type"] extends "list" ? string : never;
};
export type SettingsResult<Settings extends SettingsBase> = Partial<SettingsResultStrict<Settings>>;
export const sortFields = ["name", "date", "size", "type"] as const;
export const sortOrders = ["asc", "desc"] as const;
export type SortField = (typeof sortFields)[number];
export type SortOrder = (typeof sortOrders)[number];

export type SortMode = `${SortField}-${SortOrder}`;
