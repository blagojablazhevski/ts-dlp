import {defineConfig} from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
	tseslint.configs.recommendedTypeChecked,
	tseslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
			},
		},
	},
);
