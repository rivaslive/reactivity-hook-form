import { ComponentProps, ReactNode, useEffect, useState } from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormProps,
  useForm
} from 'react-hook-form';
import { ValidationsProvider } from '../context/ValidationsContext';
import { FormDependencies } from '../types/dependencies.type';
import {
  ArrayKey,
  FieldPathInternal
} from '../types/extend-react-hook-form.type';
import { FormValidations } from '../types/validations.type';
import { getNameAndIndexKey } from '../utils';

type FormProps<TFieldValues extends FieldValues = FieldValues> =
  UseFormProps<TFieldValues> &
    ComponentProps<'form'> & {
      children: ReactNode;
      formId?: string;
      dependencies?: FormDependencies<TFieldValues>;
      validations?: FormValidations<TFieldValues>;
      onSubmit?: SubmitHandler<TFieldValues>;
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
    ...restFormProps
  } = props;

  // using a state here to make the "scroll & focus" happen once per submission
  const [canFocus, setCanFocus] = useState(true);

  const methods = useForm<TFieldValues>({
    mode: 'onChange',
    ...restFormProps
  });

  // this useEffect is to enable the watcher and launch the action of the dependencies
  useEffect(() => {
    if (dependencies?.length) {
      const subscription = methods.watch(
        (formValues, { name: _name, type }) => {
          if (type === 'change') {
            const { name, index } = getNameAndIndexKey(_name);
            const findDependencies = dependencies.filter((dep) => {
              return dep.dependencies.includes(
                name as FieldPathInternal<TFieldValues, ArrayKey>
              );
            });

            findDependencies.forEach((dependency) =>
              dependency.callback?.(formValues, methods, { index })
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
      <ValidationsProvider validations={validations}>
        <form
          id={formId}
          onSubmit={methods.handleSubmit(onSubmit)}
          {...restFormProps}
        >
          {children}
        </form>
      </ValidationsProvider>
    </FormProvider>
  );
};

export default Form;
