import { FieldValues, UseFormReturn } from 'react-hook-form';
import { FieldPathInternal } from './extend-react-hook-form.type';

export type DependencyAction<TFieldValues extends FieldValues = FieldValues> = (
  formValues: Partial<TFieldValues>,
  methods: UseFormReturn<TFieldValues>,
  options: { index: null | number; name: string | null }
) => void;

export type FormDependencies<TFieldValues extends FieldValues = FieldValues> = {
  dependencies: FieldPathInternal<TFieldValues>[];
  callback: DependencyAction<TFieldValues>;
}[];
