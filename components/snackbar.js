import React from 'react';
import { SnackbarProvider } from 'notistack';

const SnackbarProviderWrapper = (props) => {
  return <SnackbarProvider maxSnack={3}>{props.children}</SnackbarProvider>;
};

export default SnackbarProviderWrapper;
