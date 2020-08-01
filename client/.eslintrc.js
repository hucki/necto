module.exports = {
    "env": {
        "browser": true,
        "es2020": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": ["error", 2, { "SwitchCase": 1 }],
        "keyword-spacing": "error",
        "linebreak-style": ["error", "unix"],
        "no-undef": 0,
        "no-unsued-vars": 0,
        "no-console": 0,
        "quotes": ["error", "single"],
        "react/prop-types": 0,
        "react/display-name": 0,
        "semi": ["error", "always"],
        "space-before-blocks": "error",
        "space-before-function-paren": "error"
    }
};
