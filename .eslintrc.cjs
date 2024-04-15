module.exports = {
  extends: [
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:testing-library/react"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    "react-hooks",
    "jest",
    "testing-library",
    "@typescript-eslint",
    "prettier"
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "prettier/prettier": [
      "warn",
      {
        trailingComma: "none",
        semi: true,
        endOfLine: "auto"
      }
    ],
    "no-console": [
      "warn",
      {
        allow: ["warn", "error"]
      }
    ],
    "no-debugger": ["warn"],
    "jest/no-focused-tests": "error",
    "jest/no-commented-out-tests": "warn",
    "jest/no-disabled-tests": "warn",
    "jest/prefer-spy-on": "error",
    "testing-library/prefer-screen-queries": "warn",
    "no-unreachable": "error",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        args: "none",
        ignoreRestSiblings: true
      }
    ]
  },
  overrides: [
    {
      files: ["**/*.ts?(x)"],
      rules: {
        "@typescript-eslint/ban-ts-ignore": "off",
        "@typescript-eslint/no-empty-function": [
          "error",
          {
            allow: ["private-constructors"]
          }
        ],
        "@typescript-eslint/no-inferrable-types": "off"
      }
    }
  ]
};
