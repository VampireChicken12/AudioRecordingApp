import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
const PauseIcon = ({ color }: { color: string }) => <MaterialCommunityIcons name="pause" size={24} color={color} />;
const PlayIcon = ({ color }: { color: string }) => <MaterialCommunityIcons name="play" size={24} color={color} />;
const RecIcon = ({ color }: { color: string }) => <MaterialCommunityIcons name="record" size={24} color={color} />;

const StopIcon = ({ color }: { color: string }) => <MaterialCommunityIcons name="stop" size={24} color={color} />;
export { PauseIcon, PlayIcon, StopIcon, RecIcon };
