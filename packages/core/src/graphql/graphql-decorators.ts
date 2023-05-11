import { injectable, registry } from "@aldahick/tsyringe";

/** Set on classes, to mark its resolver method names */
const RESOLVER_KEYS_KEY = "athena.graphql.ResolverKeys";
/** Set on methods, to mark the type name they handle */
const FIELD_RESOLVER_KEY = "athena.graphql.FieldResolver";

export const resolverToken = Symbol("AthenaResolver");
/**
 * Registers a class as an Athena resolver.
 */
export const resolver: () => ClassDecorator = () => (target) => {
  const constructor = target as unknown as new () => unknown;
  injectable()(constructor);
  registry([{ token: resolverToken, useClass: constructor }]);
};

/**
 * @param target An instance of a resolver class, with methods defined
 * @see {@link resolver}
 * @returns key: GraphQL type name, value: field resolver method key
 */
export const getResolverKeys = (target: object): Record<string, string> => {
  const resolverKeys: (string | symbol)[] = Reflect.getOwnMetadata(
    RESOLVER_KEYS_KEY,
    target
  );
  return Object.fromEntries(
    resolverKeys.map((key) => {
      const typeName = getResolverTypeName(target, key);
      return [typeName, key];
    })
  );
};

/**
 * @param target An instance of a resolver class, with a method named `key`
 * @param key The name of the resolver method
 * @returns the defined type name associated with the given resolver method (if any)
 * @see {@link resolveField}
 */
export const getResolverTypeName = (
  target: object,
  key: string | symbol
): string | undefined =>
  Reflect.getOwnMetadata(FIELD_RESOLVER_KEY, target, key);

/**
 * Registers a method (on a resolver) to handle a specific GraphQL field.
 * @see {@link resolver}
 * @param typeName Defaults to `${ClassName}.${methodName}`
 */
export const resolveField: (typeName?: string) => MethodDecorator =
  (typeName) => (target, propertyKey) => {
    // set field resolver's type name
    typeName ??= `${target.constructor.name}.${propertyKey.toString()}`;
    Reflect.defineMetadata(FIELD_RESOLVER_KEY, typeName, target, propertyKey);

    // add field resolver's method name to its class's resolver keys
    const resolverKeys: (string | symbol)[] =
      Reflect.getOwnMetadata(RESOLVER_KEYS_KEY, target) ?? [];
    Reflect.defineMetadata(
      RESOLVER_KEYS_KEY,
      resolverKeys.concat([propertyKey]),
      target
    );
  };

/**
 * Convenience method for resolveField(`Query.${queryName}`)
 * @see {@link resolveField}
 * @param queryName Defaults to method name
 */
export const resolveQuery: (queryName?: string) => MethodDecorator =
  (queryName) => (target, propertyKey, descriptor) => {
    queryName ??= propertyKey.toString();
    resolveField(`Query.${queryName}`)(target, propertyKey, descriptor);
  };

/**
 * Convenience method for resolveField(`Mutation.${queryName}`)
 * @see {@link resolveField}
 * @param mutationName Defaults to method name
 */
export const resolveMutation: (queryName?: string) => MethodDecorator =
  (queryName) => (target, propertyKey, descriptor) => {
    queryName ??= propertyKey.toString();
    resolveField(`Mutation.${queryName}`)(target, propertyKey, descriptor);
  };
