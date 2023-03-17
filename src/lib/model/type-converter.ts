export abstract class TypeConverter<From, To> {
  abstract convert: (from: From) => To
}

export function createTypeConverter<From, To>(
  converter: TypeConverter<From, To>['convert']
): TypeConverter<From, To> {
  return new (class NewTypeConverter extends TypeConverter<From, To> {
    convert: TypeConverter<From, To>['convert'] = converter
  })()
}
