module.exports = {
	root: true,
	extends: "@react-native-community",
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	rules: {
		"@typescript-eslint/no-unused-vars": ["error"],
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/restrict-template-expressions": "off",
		"@typescript-eslint/unbound-method": "off",
		"@typescript-eslint/restrict-plus-operands": "off",
		"prettier/prettier": ["error"],
		quotes: ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],
		semi: ["error", "always"],
		"prefer-const": [
			"error",
			{
				destructuring: "any",
				ignoreReadBeforeAssign: false
			}
		],
		"prefer-destructuring": [
			"error",
			{
				array: true,
				object: true
			},
			{
				enforceForRenamedProperties: false
			}
		],
		"no-useless-escape": "off",
		"react-native/no-inline-styles": "off",
		"react/no-unstable-nested-components": "off",
		"comma-dangle": "off",
		curly: "off",
		"no-shadow": "off"
	}
};
