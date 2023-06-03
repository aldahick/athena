import {
  DefinitionNode,
  DocumentNode,
  FieldNode,
  GraphQLResolveInfo,
  Kind,
  OperationDefinitionNode,
  SelectionNode,
} from "graphql";

export const extractSelectedFields = (
  nodes: readonly (SelectionNode | DefinitionNode)[] | GraphQLResolveInfo
): string[] => {
  if ("fieldNodes" in nodes) {
    return extractSelectedFields(nodes.fieldNodes);
  }
  return nodes.flatMap((node) => {
    const names =
      "selectionSet" in node && node.selectionSet
        ? extractSelectedFields(node.selectionSet?.selections)
        : [];
    if (node.kind === Kind.FIELD) {
      names.push(node.name.value);
    }
    return names;
  });
};

export const extractOperationNames = (document: DocumentNode): string[] =>
  document.definitions
    .filter(
      (v: DefinitionNode): v is OperationDefinitionNode =>
        v.kind === Kind.OPERATION_DEFINITION
    )
    .flatMap((d) =>
      d.selectionSet.selections
        .filter((s: SelectionNode): s is FieldNode => s.kind === Kind.FIELD)
        .map((s) => `${d.operation}.${s.name.value}`)
    );
