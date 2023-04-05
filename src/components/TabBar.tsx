import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
export default function TabBar({ state, descriptors, navigation }: MaterialTopTabBarProps) {
	return (
		<View style={{ flexDirection: "row" }}>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key]!;
				const TabBarLabel = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

				const isFocused = state.index === index;

				const onPress = () => {
					const event = navigation.emit({
						type: "tabPress",
						target: route.key,
						canPreventDefault: true
					});

					if (!isFocused && !event.defaultPrevented) {
						// The `merge: true` option makes sure that the params inside the tab screen are preserved
						navigation.navigate(route.name, { merge: true });
					}
				};

				const onLongPress = () => {
					navigation.emit({
						type: "tabLongPress",
						target: route.key
					});
				};

				return (
					<TouchableOpacity
						accessibilityRole="button"
						accessibilityState={isFocused ? { selected: true } : {}}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						testID={options.tabBarTestID}
						onPress={onPress}
						onLongPress={onLongPress}
						style={{ flex: 1 }}
					>
						{typeof TabBarLabel === "string" ? <Animated.Text>{TabBarLabel}</Animated.Text> : null}
					</TouchableOpacity>
				);
			})}
		</View>
	);
}
