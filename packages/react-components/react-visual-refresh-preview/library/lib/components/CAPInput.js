import { makeStyles, mergeClasses } from '@griffel/react';
const useCAPInputStyles = makeStyles({
    root: {}
});
export function useCAPInputStylesHook(state) {
    const styles = useCAPInputStyles();
    state.root.className = mergeClasses(state.root.className, styles.root);
    return state;
}
