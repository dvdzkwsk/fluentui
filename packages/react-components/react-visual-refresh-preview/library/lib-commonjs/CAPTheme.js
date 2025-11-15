"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    CAPTokens: function() {
        return CAPTokens;
    },
    CAPTokensSchema: function() {
        return CAPTokensSchema;
    },
    CAP_THEME: function() {
        return CAP_THEME;
    },
    CAP_THEME_ONE_DRIVE: function() {
        return CAP_THEME_ONE_DRIVE;
    },
    CAP_THEME_SHAREPOINT: function() {
        return CAP_THEME_SHAREPOINT;
    },
    CAP_THEME_TEAMS: function() {
        return CAP_THEME_TEAMS;
    }
});
const _reactcomponents = require("@fluentui/react-components");
const TOKEN_TYPES = [
    'color',
    'length'
];
const ColorTokenSchema = {
    type: 'color'
};
const BadgeTokens = {};
const ButtonTokens = {
    buttonPrimaryBackgroundColor: ColorTokenSchema,
    buttonPrimaryBackgroundColorHover: ColorTokenSchema,
    buttonSecondaryBackgroundColor: ColorTokenSchema,
    buttonSecondaryBackgroundColorHover: ColorTokenSchema,
    buttonSubtleBackgroundColor: ColorTokenSchema,
    buttonSubtleBackgroundColorHover: ColorTokenSchema,
    buttonOutlineBackgroundColor: ColorTokenSchema,
    buttonOutlineBackgroundColorHover: ColorTokenSchema,
    buttonTintBackgroundColor: ColorTokenSchema,
    buttonTintBackgroundColorHover: ColorTokenSchema
};
const CardTokens = {};
const DialogTokens = {};
const InputTokens = {};
const MenuTokens = {};
const TooltipTokens = {};
const CAPTokensSchema = {
    ...BadgeTokens,
    ...ButtonTokens,
    ...CardTokens,
    ...DialogTokens,
    ...InputTokens,
    ...MenuTokens,
    ...TooltipTokens
};
const CAPTokens = {
    ...Object.keys(CAPTokensSchema).reduce((acc, key)=>{
        return {
            ...acc,
            [key]: `var(--cap-${key})`
        };
    })
};
const CAP_THEME = {
    buttonPrimaryBackgroundColor: _reactcomponents.tokens.colorBrandBackground,
    buttonPrimaryBackgroundColorHover: _reactcomponents.tokens.colorBrandBackgroundHover,
    buttonSecondaryBackgroundColor: '#FAFAFA',
    buttonSecondaryBackgroundColorHover: '#F0F0F0',
    buttonSubtleBackgroundColor: _reactcomponents.tokens.colorBrandBackground,
    buttonSubtleBackgroundColorHover: _reactcomponents.tokens.colorBrandBackground,
    buttonOutlineBackgroundColor: _reactcomponents.tokens.colorTransparentBackground,
    buttonOutlineBackgroundColorHover: _reactcomponents.tokens.colorTransparentBackground,
    buttonTintBackgroundColor: 'red',
    buttonTintBackgroundColorHover: ''
};
const CAP_THEME_TEAMS = {
    ...CAP_THEME
};
const CAP_THEME_ONE_DRIVE = {
    ...CAP_THEME
};
const CAP_THEME_SHAREPOINT = {
    ...CAP_THEME
};
