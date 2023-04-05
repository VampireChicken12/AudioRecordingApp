import React from "react";
import { Image, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

interface MusicButtonProps {
	onPress: () => void;
	iconUrl?: string;
	children: React.ReactElement;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
}

const MusicButton = ({ onPress, iconUrl, children, disabled, style }: MusicButtonProps) => {
	const buttonStyles: StyleProp<ViewStyle>[] = [styles.button, style];
	if (disabled) {
		buttonStyles.push(styles.buttonDisabled);
	}

	return (
		<TouchableOpacity accessibilityRole="button" style={buttonStyles} onPress={onPress} disabled={disabled}>
			{iconUrl ? <Image source={{ uri: iconUrl }} style={styles.Icon} /> : null}
			{children ? children : null}
		</TouchableOpacity>
	);
};

MusicButton.defaultProps = {
	disabled: false
};

const styles = StyleSheet.create({
	button: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "transparent",
		padding: 6,
		borderRadius: 5,
		margin: 2
	},
	buttonDisabled: {
		backgroundColor: "transparent"
	},
	text: {
		color: "#fff",
		fontSize: 16,
		textAlign: "center"
	},
	Icon: {
		width: 20,
		height: 20,
		marginRight: 10,
		resizeMode: "contain"
	}
});

export default MusicButton;
