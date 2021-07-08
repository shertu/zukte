import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

const useStylesToolbarOffset = makeStyles(theme => ({
  offset: theme.mixins.toolbar,
}));

/** A view component for information posted by the Entail team. */
export function ToolbarOffset() {
  const classes = useStylesToolbarOffset();
  return <div className={classes.offset} />;
}

export default ToolbarOffset;
