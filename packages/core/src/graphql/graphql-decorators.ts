import { injectable } from "inversify";
import "reflect-metadata";

const FIELD_KEY = "athena.graphql.Field";

/**
 * Registers a class as an Athena resolver.
 */
export const resolver = injectable;

/**
 * Registers a method (on a resolver) to handle a specific GraphQL field.
 * @see {@link resolver}
 * @param typeName Defaults to `${ClassName}.${methodName}`
 */
export const resolveField: (typeName?: string) => MethodDecorator =
  (typeName) => (target, propertyKey) => {
    typeName ??= `${target.constructor.name}.${propertyKey.toString()}`;
    Reflect.defineMetadata(FIELD_KEY, typeName, target, propertyKey);
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
