import { makeStyles, mergeClasses } from '@griffel/react';
const useCAPCardStyles = makeStyles({
    root: {}
});
export function useCAPCardStylesHook(state) {
    const styles = useCAPCardStyles();
    state.root.className = mergeClasses(state.root.className, styles.root);
    return state;
}
