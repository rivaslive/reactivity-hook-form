import * as React from 'react';
import { PropsWithChildren } from 'react';
import { FieldValues } from 'react-hook-form';
import { FormValidations } from '../types/validations.type';
import { Rules } from '../types/dependencies.type';
type ValidationsContextProps<TFieldValues extends FieldValues = FieldValues> = {
    validations: FormValidations<TFieldValues>;
    getValidation: (name: string) => undefined | Rules<TFieldValues>;
};
export declare function ValidationsProvider<TFieldValues extends FieldValues = FieldValues>({ children, validations }: PropsWithChildren<Partial<Pick<ValidationsContextProps<TFieldValues>, 'validations'>>>): React.JSX.Element;
export declare function useValidations<TFieldValues extends FieldValues = FieldValues>(): ValidationsContextProps<TFieldValues>;
export {};
