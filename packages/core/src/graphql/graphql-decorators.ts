import { container, makeRegistryDecorator } from "../container.js";

/** Set on classes, to store info about all its resolvers */
const RESOLVER_INFOS_KEY = Symbol("ResolversInfo");
export type ResolverInfo = {
  propertyKey: string | symbol;
  typeName: string;
  batch: boolean;
};

/**
 * Exported for testing only.
 * @see {@link injectResolvers} and {@link resolver} to fetch and register resolvers, respectively
 */
export const resolverToken = Symbol("Resolver");

/**
 * Registers a class as an Athena resolver.
 */
export const resolver = makeRegistryDecorator(resolverToken);

export const getResolverInstances = (): object[] =>
  container.isRegistered(resolverToken)
    ? container.resolveAll(resolverToken)
    : [];

export const getResolverInfos = (target: object): ResolverInfo[] =>
  Reflect.getMetadata(RESOLVER_INFOS_KEY, target) ?? [];

const addResolverInfo = (target: object, info: ResolverInfo): void => {
  const infos = getResolverInfos(target);
  infos.push(info);
  Reflect.defineMetadata(RESOLVER_INFOS_KEY, infos, target);
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

export const resolveScalar =
  (typeName: string): PropertyDecorator =>
  (target, propertyKey) => {
    addResolverInfo(target, {
      propertyKey,
      typeName,
      batch: false,
    });
  };

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
    if (typeof descriptor.value !== "function") {
      throw new Error(
        `Cannot use a non-function type to resolve a GraphQL field: ${typeName}`,
      );
    }
    addResolverInfo(target, {
      propertyKey,
      typeName: typeName ?? makeDefaultTypeName(target, propertyKey),
      batch,
    });
  };

const makeDefaultTypeName = (
  target: object,
  propertyKey: string | symbol,
): string => `${target.constructor.name}.${propertyKey.toString()}`;
