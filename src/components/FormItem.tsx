import React from 'react';
import {
  Controller,
  ControllerProps as RHFControllerProps,
  FieldValues,
  useFormContext,
  UseFormReturn,
  ControllerRenderProps,
  ControllerFieldState,
  UseFormStateReturn
} from 'react-hook-form';
import { FieldPath, FieldPathValue } from 'react-hook-form/dist/types';
import { useValidations } from '../context/ValidationsContext';
import { cleanInputProps, hasRenderFunction } from '../utils';

type ControllerProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  RHFControllerProps<TFieldValues>,
  'render' | 'control'
>;

type InputFieldProps<TFieldValues extends FieldValues = FieldValues> =
  ControllerProps<TFieldValues> & {
    children: React.ReactElement<{
      cyName: string;
      value: TFieldValues | unknown;
      checked: TFieldValues | unknown;
      helperText?: string;
      focused?: boolean;
      error?: boolean;
      onChange?: InputFieldProps<TFieldValues>['onChange'];
    }>;
    injectPropsField?: string[];
    getValue?: (
      value: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>
    ) => unknown;
    onChange?: (
      event: unknown,
      props: {
        field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
        fieldState: ControllerFieldState;
        formState: UseFormStateReturn<TFieldValues>;
      }
    ) => void;
  };

export type RenderFieldProps<TFieldValues> = {
  children: (context: UseFormReturn<TFieldValues>) => React.ReactElement;
  name?: never;
  rules?: never;
};

export type FieldProps<TFieldValues extends FieldValues = FieldValues> =
  | InputFieldProps<TFieldValues>
  | RenderFieldProps<TFieldValues>;

export const FormItem = <TFieldValues extends FieldValues = FieldValues>(
  props: FieldProps<TFieldValues>
): JSX.Element => {
  const formContext = useFormContext<TFieldValues>();
  const { getValidation } = useValidations<TFieldValues>();

  if (hasRenderFunction(props)) {
    return props.children(formContext);
  }

  const {
    children,
    name,
    rules,
    onChange,
    getValue,
    injectPropsField = [],
    ...restControllerProps
  } = props;

  return (
    <Controller
      {...restControllerProps}
      rules={{
        ...getValidation(name),
        ...rules
      }}
      name={name}
      control={formContext.control}
      render={(renderProps) => {
        const { field, fieldState } = renderProps;

        const propsFieldInject = injectPropsField.reduce((acc, currentKey) => {
          return {
            ...acc,
            [currentKey]: cleanInputProps(field[currentKey])
          };
        }, {});

        return React.cloneElement(children, {
          ...field,
          ...propsFieldInject,
          cyName: field?.name,
          helperText: fieldState.error
            ? fieldState.error.message
            : children?.props?.helperText || '',
          error: !!fieldState.error,
          value: getValue ? getValue(field.value) : field.value,
          checked: getValue ? getValue(field.value) : field.value,
          onChange: (args) => {
            onChange ? onChange(args, renderProps) : field.onChange(args);
          }
        });
      }}
    />
  );
};
