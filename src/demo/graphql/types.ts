export type Maybe<T> = T | undefined;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: File;
};

export enum ICacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

/** the only one that isn't "extend type" */
export type IMutation = {
   __typename?: 'Mutation';
  /** obviously you'd normally actually authenticate, but this _is_ a demo */
  createAuthToken: Scalars['String'];
};


/** the only one that isn't "extend type" */
export type IMutationCreateAuthTokenArgs = {
  username: Scalars['String'];
};

export type IQuery = {
   __typename?: 'Query';
  hello: Scalars['String'];
  roles: Array<IRole>;
  users: Array<IUser>;
};

export type IRole = {
   __typename?: 'Role';
  id: Scalars['Int'];
  name: Scalars['String'];
};


export type IUser = {
   __typename?: 'User';
  id: Scalars['String'];
  username: Scalars['String'];
};

