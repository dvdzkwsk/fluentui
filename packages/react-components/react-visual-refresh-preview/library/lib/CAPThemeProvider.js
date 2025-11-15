import * as React from 'react';
import { FluentProvider } from '@fluentui/react-components';
import { useCAPButtonStylesHook } from './components/CAPButton';
import { useCAPBadgeStylesHook } from './components/CAPBadge';
import { useCAPInputStylesHook } from './components/CAPInput';
import { useCAPCardStylesHook } from './components/CAPCard';
export const CAPThemeProvider = ({ children, theme })=>{
    const customStyleHooks = React.useMemo(()=>{
        return {
            useBadgeStyles_unstable: (state)=>useCAPBadgeStylesHook(state),
            useButtonStyles_unstable: (state)=>useCAPButtonStylesHook(state),
            useCardStyles_unstable: (state)=>useCAPCardStylesHook(state),
            useInputStyles_unstable: (state)=>useCAPInputStylesHook(state)
        };
    }, []);
    const styles = {};
    for (const [tokenName, tokenValue] of Object.entries(theme)){
        styles[`--cap-${tokenName}`] = tokenValue;
    }
    return /*#__PURE__*/ React.createElement(FluentProvider, {
        theme: theme,
        customStyleHooks_unstable: customStyleHooks,
        style: styles
    }, children);
};
