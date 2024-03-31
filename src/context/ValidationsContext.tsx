import * as React from 'react';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useCallback
} from 'react';
import { FieldValues } from 'react-hook-form';
import { FormValidations } from '../types/validations.type';
import { getNameAndIndexKey } from '../utils';
import {
  ArrayKey,
  FieldPathInternal
} from '../types/extend-react-hook-form.type';
import { Rules } from '../types/dependencies.type';

type ValidationsContextProps<TFieldValues extends FieldValues = FieldValues> = {
  validations: FormValidations<TFieldValues>;
  getValidation: (name: string) => undefined | Rules<TFieldValues>;
};

const ValidationsContext = createContext<any>(null);

export function ValidationsProvider<
  TFieldValues extends FieldValues = FieldValues
>({
  children,
  validations = {}
}: PropsWithChildren<
  Partial<Pick<ValidationsContextProps<TFieldValues>, 'validations'>>
>) {
  const getValidation = useCallback<
    ValidationsContextProps<TFieldValues>['getValidation']
  >(
    (_name: string) => {
      const { name } = getNameAndIndexKey(_name);
      return validations?.[name as FieldPathInternal<TFieldValues, ArrayKey>];
    },
    [validations]
  );

  return (
    <ValidationsContext.Provider value={{ validations, getValidation }}>
      {children}
    </ValidationsContext.Provider>
  );
}

export function useValidations<
  TFieldValues extends FieldValues = FieldValues
>() {
  const context =
    useContext<ValidationsContextProps<TFieldValues>>(ValidationsContext);

  if (!context) {
    console.error('useValidations must be used within a ValidationsProvider');
  }

  return context;
}
