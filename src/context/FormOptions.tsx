import * as React from 'react';
import { createContext, PropsWithChildren, useContext } from 'react';

export type FormOptions = {
  showErrorText?: boolean;
};

const FormOptionsContext = createContext<FormOptions>({
  showErrorText: true
});

export function ReactivityHookFormProvider({
  children,
  showErrorText = true
}: PropsWithChildren<FormOptions>) {
  return (
    <FormOptionsContext.Provider value={{ showErrorText }}>
      {children}
    </FormOptionsContext.Provider>
  );
}

export function useFormOptions() {
  return useContext(FormOptionsContext);
}
