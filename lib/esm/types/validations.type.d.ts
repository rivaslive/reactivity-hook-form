import { FieldValues, RegisterOptions } from 'react-hook-form';
import { FieldPath, FieldPathValue } from 'react-hook-form/dist/types/path';
import { FieldPathInternal, InternalValidate } from './extend-react-hook-form.type';
export type Rules<TFieldValues extends FieldValues = FieldValues, TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = Omit<RegisterOptions<TFieldValues>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled' | 'validate'> & {
    validate?: InternalValidate<FieldPathValue<TFieldValues, TFieldName>, TFieldValues> | Record<string, InternalValidate<FieldPathValue<TFieldValues, TFieldName>, TFieldValues>>;
};
export type FormValidations<TFieldValues extends FieldValues = FieldValues> = {
    [key in FieldPathInternal<TFieldValues>]?: Rules<TFieldValues>;
};
