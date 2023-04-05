export default function formatBytes(bytes: number, decimals?: number) {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const dm = (decimals && decimals + 1) || 3;
	const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm))
		? `${round(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)), 1)} ${sizes[i]}`
		: "Unable to determine size";
}
const round = (number: number, decimalPlaces: number) => {
	const factorOfTen = Math.pow(10, decimalPlaces);
	return Math.round(number * factorOfTen) / factorOfTen;
};
