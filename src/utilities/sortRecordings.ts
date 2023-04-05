import { SortField, SortOrder } from "@/types";
import RecordingsArray from "./RecordingArray";

export default function sortRecordings(recordings: RecordingsArray, sortField: SortField, sortOrder: SortOrder) {
	return recordings.sort((a, b) => {
		switch (sortField) {
			case "name":
				return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
			case "date": {
				if (a.mtime && b.mtime) {
					return sortOrder === "asc"
						? new Date(a.mtime).getTime() - new Date(b.mtime).getTime()
						: new Date(b.mtime).getTime() - new Date(a.mtime).getTime();
				}
				return 0;
			}
			case "size":
				return sortOrder === "asc" ? a.size - b.size : b.size - a.size;
			case "type":
				return sortOrder === "asc"
					? a.name.slice(a.name.lastIndexOf(".") + 1).localeCompare(b.name.slice(b.name.lastIndexOf(".") + 1))
					: b.name.slice(b.name.lastIndexOf(".") + 1).localeCompare(a.name.slice(a.name.lastIndexOf(".") + 1));
			default:
				return 0;
		}
	});
}
