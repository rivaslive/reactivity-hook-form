import { IsTuple, TupleKeys } from 'react-hook-form/dist/types/path/common';
import {
  BrowserNativeObject,
  IsEqual,
  Primitive,
} from 'react-hook-form/dist/types/utils';
import { ValidateResult } from 'react-hook-form/dist/types/validator';

export type ArrayKey = '[number]';

type AnyIsEqual<T1, T2> = T1 extends T2
  ? IsEqual<T1, T2> extends true
    ? true
    : never
  : never;

type PathImpl<
  K extends string | number,
  V,
  TraversedTypes,
  ArrayK extends string | number
> = V extends Primitive | BrowserNativeObject
  ? `${K}`
  : true extends AnyIsEqual<TraversedTypes, V>
    ? `${K}`
    : `${K}` | `${K}.${FieldPathInternal<V, ArrayK, TraversedTypes | V>}`;

export type FieldPathInternal<
  T,
  ArrayK extends string | number,
  TraversedTypes = T
> = T extends ReadonlyArray<infer V>
  ? IsTuple<T> extends true
    ? {
      [K in TupleKeys<T>]-?: PathImpl<
        K & string,
        T[K],
        TraversedTypes,
        ArrayK
      >;
    }[TupleKeys<T>]
    : PathImpl<ArrayK, V, TraversedTypes, ArrayK>
  : {
    [K in keyof T]-?: PathImpl<K & string, T[K], TraversedTypes, ArrayK>;
  }[keyof T];

export type InternalValidate<TFieldValue, TFormValues> = (
  value: TFieldValue,
  formValues: TFormValues,
  options: {
    index: number | null;
    name: string | null;
  }
) => ValidateResult | Promise<ValidateResult>;
