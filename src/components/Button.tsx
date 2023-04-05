import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, ViewStyle, StyleProp } from "react-native";

interface ButtonProps {
	onPress: () => void;
	title: string;
	iconUrl?: string;
	IconComponent?: () => JSX.Element;
	iconPosition?: "left" | "right";
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
}

const Button = ({ onPress, title, iconUrl, IconComponent, iconPosition, disabled, style }: ButtonProps) => {
	const buttonStyles: StyleProp<ViewStyle>[] = [styles.button, style];
	if (disabled) {
		buttonStyles.push(styles.buttonDisabled);
	}

	return (
		<TouchableOpacity accessibilityRole="button" style={buttonStyles} onPress={onPress} disabled={disabled}>
			{iconUrl ? (
				<>
					{iconPosition === "left" && <Image source={{ uri: iconUrl }} style={styles.Icon} />}
					<Text style={styles.text}>{title}</Text>
					{iconPosition === "right" && <Image source={{ uri: iconUrl }} style={styles.Icon} />}
				</>
			) : null}
			{IconComponent ? (
				<>
					<IconComponent />
					<Text style={styles.text}>{title}</Text>
				</>
			) : null}
		</TouchableOpacity>
	);
};

Button.defaultProps = {
	iconPosition: "left",
	disabled: false
};

const styles = StyleSheet.create({
	button: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#008eff",
		padding: 6,
		borderRadius: 5,
		margin: 2
	},
	buttonDisabled: {
		backgroundColor: "#004b88"
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

export default Button;
