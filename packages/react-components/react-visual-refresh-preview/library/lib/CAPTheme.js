import { tokens } from '@fluentui/react-components';
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
export const CAPTokensSchema = {
    ...BadgeTokens,
    ...ButtonTokens,
    ...CardTokens,
    ...DialogTokens,
    ...InputTokens,
    ...MenuTokens,
    ...TooltipTokens
};
export const CAPTokens = {
    ...Object.keys(CAPTokensSchema).reduce((acc, key)=>{
        return {
            ...acc,
            [key]: `var(--cap-${key})`
        };
    })
};
export const CAP_THEME = {
    buttonPrimaryBackgroundColor: tokens.colorBrandBackground,
    buttonPrimaryBackgroundColorHover: tokens.colorBrandBackgroundHover,
    buttonSecondaryBackgroundColor: '#FAFAFA',
    buttonSecondaryBackgroundColorHover: '#F0F0F0',
    buttonSubtleBackgroundColor: tokens.colorBrandBackground,
    buttonSubtleBackgroundColorHover: tokens.colorBrandBackground,
    buttonOutlineBackgroundColor: tokens.colorTransparentBackground,
    buttonOutlineBackgroundColorHover: tokens.colorTransparentBackground,
    buttonTintBackgroundColor: 'red',
    buttonTintBackgroundColorHover: ''
};
export const CAP_THEME_TEAMS = {
    ...CAP_THEME
};
export const CAP_THEME_ONE_DRIVE = {
    ...CAP_THEME
};
export const CAP_THEME_SHAREPOINT = {
    ...CAP_THEME
};
