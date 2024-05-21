import * as React from 'react';
import { ComponentProps, ReactNode, useEffect, useState } from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormProps,
  useForm,
  UseFormReturn
} from 'react-hook-form';
import { ValidationsProvider } from '../context/ValidationsContext';
import { FormDependencies } from '../types/dependencies.type';
import { FieldPathInternal } from '../types/extend-react-hook-form.type';
import { FormValidations } from '../types/validations.type';
import { getNameAndIndexKey } from '../utils';
import { FormOptions, FormOptionsProvider } from '../context/FormOptions';

type FormProps<TFieldValues extends FieldValues = FieldValues> =
  UseFormProps<TFieldValues> &
    Partial<FormOptions> &
    Omit<ComponentProps<'form'>, 'onSubmit'> & {
      children: ReactNode;
      formId?: string;
      gap?: number;
      dependencies?: FormDependencies<TFieldValues>;
      validations?: FormValidations<TFieldValues>;
      onSubmit?: SubmitHandler<TFieldValues>;
      formContext?: UseFormReturn<TFieldValues>;
    };

const Form = <TFieldValues extends FieldValues = FieldValues>(
  props: FormProps<TFieldValues>
): JSX.Element => {
  const {
    formId,
    children,
    dependencies,
    validations,
    onSubmit,
    formContext,
    defaultValues,
    gap = 16,
    showErrorText = true,
    ...restFormProps
  } = props;

  // using a state here to make the "scroll & focus" happen once per submission
  const [canFocus, setCanFocus] = useState(true);

  const methods =
    formContext ??
    useForm<TFieldValues>({
      mode: 'onChange',
      defaultValues,
      ...restFormProps
    });

  // this useEffect is to enable the watcher and launch the action of the dependencies
  useEffect(() => {
    if (dependencies?.length) {
      const subscription = methods.watch(
        (formValues, { name: _name, type }) => {
          if (type === 'change' && _name) {
            const { name, index } = getNameAndIndexKey(_name);
            const findDependencies = dependencies.filter((dep) => {
              return dep.dependencies.includes(
                name as FieldPathInternal<TFieldValues>
              );
            });

            findDependencies.forEach((dependency) =>
              dependency.callback?.(formValues, methods, { index, name })
            );
          }
        }
      );

      return () => subscription.unsubscribe();
    }
    return () => {};
  }, [methods, dependencies]);

  // This useEffect is to enable auto-scroll to the input with error
  useEffect(() => {
    if (methods.formState.errors && canFocus) {
      // Sort inputs based on their position on the page. (the order will be based on validaton order otherwise)
      const elements = Object.keys(methods.formState.errors)
        .map((name) => document.getElementsByName(name)[0])
        .filter(Boolean)
        .sort(
          (a, b) =>
            a.getBoundingClientRect().top - b.getBoundingClientRect().top
        );

      if (elements.length > 0) {
        const errorElement = elements[0];
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); // scrollIntoView options are not supported in Safari
        errorElement.focus({ preventScroll: true });
      }

      setCanFocus(false);
    }
  }, [methods.formState, canFocus]);

  useEffect(() => {
    setCanFocus(true);
  }, [methods.formState.submitCount]);

  return (
    <FormProvider {...methods}>
      <FormOptionsProvider showErrorText={showErrorText}>
        <ValidationsProvider validations={validations}>
          <form
            id={formId}
            onSubmit={methods.handleSubmit(onSubmit ?? (() => {}))}
            {...restFormProps}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap,
              ...restFormProps?.style
            }}
          >
            {children}
          </form>
        </ValidationsProvider>
      </FormOptionsProvider>
    </FormProvider>
  );
};

export default Form;
