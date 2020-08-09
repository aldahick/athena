import { decoratorUtils } from "../../util";

export const RESOLVER_METADATA_KEY = "athena.resolver";

export interface ResolverMetadata {
  methodName: string;
  type: string;
  field: string;
}

const buildMetadataSetter = (buildType: (key: string) => string): MethodDecorator =>
  (target, key): void => {
    const [type, field] = buildType(key.toString()).split(".");
    decoratorUtils.push<ResolverMetadata>(RESOLVER_METADATA_KEY, {
      methodName: key.toString(),
      type, field
    }, target);
  };

export const query = (type?: string): MethodDecorator =>
  buildMetadataSetter(key => `Query.${type ?? key}`);

export const mutation = (type?: string): MethodDecorator =>
  buildMetadataSetter(key => `Mutation.${type ?? key}`);

export const resolver = (type: string): MethodDecorator =>
  buildMetadataSetter(() => type);

export const scalar = (type: string): PropertyDecorator =>
  buildMetadataSetter(() => type) as PropertyDecorator;
