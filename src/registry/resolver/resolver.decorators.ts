import { DecoratorUtils } from "../../util";

export const RESOLVER_METADATA_KEY = "athena.resolver";

export interface ResolverMetadata {
  methodName: string;
  type: string;
  field: string;
}

export const query = (type?: string) => buildMetadataSetter(key => `Query.${type || key}`);

export const mutation = (type?: string) => buildMetadataSetter(key => `Mutation.${type || key}`);

export const resolver = (type: string) => buildMetadataSetter(() => type);

const buildMetadataSetter = (buildType: (key: string) => string): MethodDecorator => (target, key) => {
  const [type, field] = buildType(key.toString()).split(".");
  DecoratorUtils.push<ResolverMetadata>(RESOLVER_METADATA_KEY, {
    methodName: key.toString(),
    type, field
  }, target);
};
