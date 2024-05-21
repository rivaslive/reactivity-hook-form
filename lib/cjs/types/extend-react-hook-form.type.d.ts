import { IsTuple, TupleKeys } from 'react-hook-form/dist/types/path/common';
import { BrowserNativeObject, IsEqual, Primitive } from 'react-hook-form/dist/types/utils';
import { ValidateResult } from 'react-hook-form/dist/types/validator';
export type ArrayKey = '[number]';
type AnyIsEqual<T1, T2> = T1 extends T2 ? IsEqual<T1, T2> extends true ? true : never : never;
type PathImpl<K extends string | number, V, TraversedTypes> = V extends Primitive | BrowserNativeObject ? `${K}` : true extends AnyIsEqual<TraversedTypes, V> ? `${K}` : `${K}` | `${K}.${PathInternal<V, TraversedTypes | V>}`;
/**
 * Helper type for recursively constructing paths through a type.
 * This obscures the internal type param TraversedTypes from exported contract.
 *
 * See {@link Path}
 */
type PathInternal<T, TraversedTypes = T> = T extends ReadonlyArray<infer V> ? IsTuple<T> extends true ? {
    [K in TupleKeys<T>]-?: PathImpl<K & string, T[K], TraversedTypes>;
}[TupleKeys<T>] : PathImpl<ArrayKey, V, TraversedTypes> : {
    [K in keyof T]-?: PathImpl<K & string, T[K], TraversedTypes>;
}[keyof T];
export type FieldPathInternal<T> = T extends any ? PathInternal<T, ArrayKey> : never;
export type InternalValidate<TFieldValue, TFormValues> = (value: TFieldValue, formValues: TFormValues, options: {
    index: number | null;
    name: string | null;
}) => ValidateResult | Promise<ValidateResult>;
export {};
