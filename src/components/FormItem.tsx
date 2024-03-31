import React, { ReactNode, ComponentProps } from 'react';
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
import { useFormOptions } from '../context/FormOptions';

type ControllerProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  RHFControllerProps<TFieldValues>,
  'render' | 'control'
>;

export type FieldAccessoryProps<
  TFieldValues extends FieldValues = FieldValues
> = {
  field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<TFieldValues>;
};

type InputFieldProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  ControllerProps<TFieldValues>,
  'onChange'
> &
  Omit<ComponentProps<'div'>, 'children' | 'onChange'> & {
    children: React.ReactElement<{
      cyName: string;
      value: TFieldValues | unknown;
      checked: TFieldValues | unknown;
      helperText?: string;
      focused?: boolean;
      error?: boolean;
      onChange?: InputFieldProps<TFieldValues>['onChange'];
    }>;
    label?: ReactNode;
    labelProps?: Omit<React.ComponentProps<'label'>, 'children'>;
    injectPropsField?: string[];
    getValue?: (
      value: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>
    ) => unknown;
    sanitize?: (props: FieldAccessoryProps<TFieldValues>) => {
      [key: string]: unknown;
    };
    onChange?: (
      event: any,
      props: FieldAccessoryProps<TFieldValues> & {
        context: UseFormReturn<TFieldValues>;
      }
    ) => void;
  };

export type RenderFieldProps<TFieldValues extends FieldValues = FieldValues> = {
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
  const { showErrorText } = useFormOptions();

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
    label,
    labelProps,
    shouldUnregister,
    disabled,
    defaultValue,
    sanitize = () => ({}),
    ...restDivProps
  } = props;

  return (
    <Controller
      rules={{
        ...getValidation(name),
        ...rules
      }}
      name={name}
      disabled={disabled}
      defaultValue={defaultValue}
      control={formContext.control}
      shouldUnregister={shouldUnregister}
      render={(renderProps) => {
        const { field, fieldState } = renderProps;

        const propsFieldInject = injectPropsField.reduce((acc, currentKey) => {
          return {
            ...acc,
            [currentKey]: cleanInputProps(field)
          };
        }, {});

        const childrenElement = React.cloneElement(children, {
          ...field,
          ...propsFieldInject,
          helperText: fieldState.error
            ? fieldState.error.message
            : children?.props?.helperText || '',
          error: !!fieldState.error,
          value: getValue ? getValue(field.value) : field.value,
          checked: getValue ? getValue(field.value) : field.value,
          onChange: (args: any) => {
            onChange
              ? onChange(args, { ...renderProps, context: formContext })
              : field.onChange(args);
          },
          ...sanitize(renderProps)
        });

        const errorText =
          showErrorText && !!fieldState.error ? (
            <p className="error-text helper-text">
              {fieldState.error?.message}
            </p>
          ) : null;

        const helperText =
          !fieldState.error && !!children?.props?.helperText ? (
            <p className="helper-text">{children?.props?.helperText}</p>
          ) : null;

        if (label) {
          return (
            <div {...restDivProps}>
              <label
                htmlFor={name}
                {...labelProps}
                className={`label ${labelProps?.className}`}
              >
                {label && <span className="label-text">{label}</span>}

                {childrenElement}
              </label>
              {errorText}
              {helperText}
            </div>
          );
        }

        return (
          <div {...restDivProps}>
            {childrenElement}

            {errorText}
            {helperText}
          </div>
        );
      }}
    />
  );
};
