import { DeepPartial, FieldValues, RegisterOptions, UseFormReturn } from 'react-hook-form';
import { FieldPathInternal, ArrayKey } from './extend-react-hook-form.type';
export type Rules<TFieldValues extends FieldValues = FieldValues> = Omit<RegisterOptions<TFieldValues>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
export type DependencyAction<TFieldValues extends FieldValues = FieldValues> = (formValues: DeepPartial<TFieldValues> | TFieldValues, methods: UseFormReturn<TFieldValues>, options: {
    index: null | number;
}) => void;
export type FormDependencies<TFieldValues extends FieldValues = FieldValues> = {
    dependencies: FieldPathInternal<TFieldValues, ArrayKey>[];
    callback: DependencyAction<TFieldValues>;
}[];
