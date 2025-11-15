import { makeStyles, mergeClasses } from '@griffel/react';
const useCAPBadgeStyles = makeStyles({
    root: {}
});
export function useCAPBadgeStylesHook(state) {
    const styles = useCAPBadgeStyles();
    state.root.className = mergeClasses(state.root.className, styles.root);
    return state;
}
