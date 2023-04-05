import { SettingsBase } from "@/types";

type Payload = Record<string, string | boolean | undefined>;
export default function mergeChanges<Settings extends SettingsBase>(prev: Settings, updates: Payload): Settings {
	let next = prev;

	for (const [key, value] of Object.entries(updates)) {
		if (!(key in next)) {
			continue;
		}

		const element = next[key]!;

		if (element.type === "list") {
			if (typeof value === "string" && element.value !== value) {
				next = { ...next, [key]: { ...element, value } };
			}
		} else if (element.type === "switch") {
			if (typeof value === "boolean" && element.value !== value) {
				next = { ...next, [key]: { ...element, value } };
			}
		} else {
			if (typeof value === "string" && element.details !== value) {
				next = { ...next, [key]: { ...element, details: value } };
			}
		}
	}

	return next;
}
