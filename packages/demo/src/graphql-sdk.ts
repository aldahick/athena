import { GraphQLClient, gql, RequestOptions } from "graphql-request";

type Maybe<T> = T | undefined;
type InputMaybe<T> = T | undefined;
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
type GraphQLClientRequestHeaders = RequestOptions["requestHeaders"];
/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

type IQuery = {
  __typename?: "Query";
  hello: Scalars["String"]["output"];
  users: IUser[];
};

type ISubscription = {
  __typename?: "Subscription";
  userUpdated: IUser;
};

type IUser = {
  __typename?: "User";
  id: Scalars["ID"]["output"];
  username: Scalars["String"]["output"];
};

type IHelloQueryVariables = Exact<{ [key: string]: never }>;

type IHelloQuery = { __typename?: "Query"; hello: string };

type IGetUsersQueryVariables = Exact<{ [key: string]: never }>;

type IGetUsersQuery = {
  __typename?: "Query";
  users: Array<{ __typename?: "User"; id: string; username: string }>;
};

const HelloDocument = gql`
    query hello {
  hello
}
    `;
const GetUsersDocument = gql`
    query getUsers {
  users {
    id
    username
  }
}
    `;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
  variables?: any,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
  _variables,
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    hello(
      variables?: IHelloQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"],
    ): Promise<IHelloQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<IHelloQuery>({
            document: HelloDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "hello",
        "query",
        variables,
      );
    },
    getUsers(
      variables?: IGetUsersQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit["signal"],
    ): Promise<IGetUsersQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<IGetUsersQuery>({
            document: GetUsersDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        "getUsers",
        "query",
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
