import { compact } from "@athenajs/utils";

import { injectable, injectAll, registry } from "../container.js";

/** Set on classes, to mark its resolver method names */
const RESOLVER_KEYS_KEY = Symbol("ResolverKeys");
/** Set on methods, to mark whether they should be executed as batch resolvers or not */
const FIELD_RESOLVER_BATCH_KEY = Symbol("FieldResolverBatch");
/** Set on methods, to mark the type name they handle */
const FIELD_RESOLVER_KEY = Symbol("FieldResolver");

const resolverToken = Symbol("Resolver");

export const injectResolvers = (): ParameterDecorator =>
  injectAll(resolverToken);

/**
 * Registers a class as an Athena resolver.
 */
export const resolver = (): ClassDecorator => (target) => {
  const constructor = target as unknown as new () => unknown;
  injectable()(constructor);
  registry([{ token: resolverToken, useClass: constructor }])(target);
};

/**
 * @param target An instance of a resolver class, with methods defined
 * @see {@link resolver}
 * @returns key: GraphQL type name, value: field resolver method key and batch
 */
export const getResolverInfo = (
  target: object
): Map<string, { key: string | symbol; batch: boolean }> => {
  const keys: (string | symbol)[] =
    Reflect.getMetadata(RESOLVER_KEYS_KEY, target) ?? [];
  return new Map(
    compact(
      keys.map((key) => {
        const typeName = getResolverTypeName(target, key);
        if (key && typeName) {
          const batch = getResolverBatch(target, key);
          return [typeName, { key, batch }];
        }
      })
    )
  );
};

/**
 * @see {@link getResolverTypeName}
 * @returns whether the resolver should be executed in batch or not
 */
export const getResolverBatch = (
  target: object,
  key: string | symbol
): boolean => !!Reflect.getMetadata(FIELD_RESOLVER_BATCH_KEY, target, key);

/**
 * @param target An instance of a resolver class, with a method named `key`
 * @param key The name of the resolver method
 * @returns the defined type name associated with the given resolver method (if any)
 * @see {@link resolveField}
 */
export const getResolverTypeName = (
  target: object,
  key: string | symbol
): string | undefined => Reflect.getMetadata(FIELD_RESOLVER_KEY, target, key);

const makeDefaultTypeName = (
  target: object,
  propertyKey: string | symbol
): string => `${target.constructor.name}.${propertyKey.toString()}`;

/**
 * Registers a method (on a resolver) to handle a specific GraphQL field.
 * @todo improve batch docs
 * @see {@link resolver}
 * @param typeName Defaults to `${ClassName}.${methodName}`
 * @param batch If true, a batch resolver is registered.
 * It should return resolved values in the same order as the provided Root values.
 * The signature of your method should be:
 * (Root[], Args, Context, GraphQLResolveInfo) => Promise<Root[Key][]>
 */
export const resolveField =
  (typeName?: string, batch = false): MethodDecorator =>
  (target, propertyKey, descriptor) => {
    typeName ??= makeDefaultTypeName(target, propertyKey);
    if (typeof descriptor.value !== "function") {
      throw new Error(
        `Cannot use a non-function type to resolve a GraphQL field: ${typeName}`
      );
    }
    if (batch) {
      Reflect.defineMetadata(
        FIELD_RESOLVER_BATCH_KEY,
        true,
        target,
        propertyKey
      );
    }
    // set field resolver's type name
    Reflect.defineMetadata(FIELD_RESOLVER_KEY, typeName, target, propertyKey);

    // add field resolver's method name to its class's resolver keys
    const resolverKeys: (string | symbol)[] =
      Reflect.getMetadata(RESOLVER_KEYS_KEY, target) ?? [];
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
export const resolveQuery =
  (queryName?: string): MethodDecorator =>
  (target, propertyKey, descriptor) => {
    queryName ??= propertyKey.toString();
    resolveField(`Query.${queryName}`)(target, propertyKey, descriptor);
  };

/**
 * Convenience method for resolveField(`Mutation.${queryName}`)
 * @see {@link resolveField}
 * @param mutationName Defaults to method name
 */
export const resolveMutation =
  (mutationName?: string): MethodDecorator =>
  (target, propertyKey, descriptor) => {
    mutationName ??= propertyKey.toString();
    resolveField(`Mutation.${mutationName}`)(target, propertyKey, descriptor);
  };
