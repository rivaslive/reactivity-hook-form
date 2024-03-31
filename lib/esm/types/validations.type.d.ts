import { FieldValues } from 'react-hook-form';
import { Rules } from './dependencies.type';
import { FieldPathInternal, ArrayKey } from './extend-react-hook-form.type';
export type FormValidations<TFieldValues extends FieldValues = FieldValues> = {
    [key in FieldPathInternal<TFieldValues, ArrayKey>]?: Rules<TFieldValues>;
};
