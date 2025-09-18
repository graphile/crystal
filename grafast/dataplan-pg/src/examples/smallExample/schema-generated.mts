export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Datetime: { input: any; output: any; }
};

export type Post = {
  __typename?: 'Post';
  author?: Maybe<User>;
  body: Scalars['String']['output'];
  createdAt: Scalars['Datetime']['output'];
  id: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  posts?: Maybe<Array<Maybe<Post>>>;
  users?: Maybe<Array<Maybe<User>>>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['Datetime']['output'];
  id: Scalars['Int']['output'];
  posts?: Maybe<Array<Maybe<Post>>>;
  username: Scalars['String']['output'];
};

// Generated GraphQL SDK (auto-generated – do not edit)

import type { EnumPlan, EnumValueInput, FieldPlan, InputFieldPlan, GrafastSchemaConfig, InputObjectPlan, InterfacePlan, ObjectPlan, ScalarPlan, Step, UnionPlan, StepRepresentingList } from 'grafast';
import { makeGrafastSchema } from 'grafast';
import type { Overrides } from './schema-manual-types.mjs';

type NoArguments = Record<string, never>;
type NonNullStep<TStep extends Step> = TStep & Step<TStep extends Step<infer U> ? NonNullable<U> : any>;
type ListOfStep<TStep extends Step> = StepRepresentingList<TStep extends Step<infer U> ? U : any, TStep>;

type Get<
  TTypeName extends string,
  TProp extends string,
  TFallback = any,
> = TTypeName extends keyof Overrides
  ? TProp extends keyof Overrides[TTypeName]
    ? NonNullable<Overrides[TTypeName][TProp]>
    : TFallback
  : TFallback;

export interface TypedGrafastSchemaSpec extends Omit<GrafastSchemaConfig, 'objects' | 'interfaces' | 'unions' | 'inputObjects' | 'scalars' | 'enums'> {
  objects?: {
    Post?: Omit<ObjectPlan<Get<"Post", "source", NonNullStep<Get<"Post", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        author?: FieldPlan<Get<"Post", "source", NonNullStep<Get<"Post", "nullable", Step>>>, NoArguments, Get<"User", "nullable", Step>>;
        body?: FieldPlan<Get<"Post", "source", NonNullStep<Get<"Post", "nullable", Step>>>, NoArguments, NonNullStep<Get<"String", "nullable", Step>>>;
        createdAt?: FieldPlan<Get<"Post", "source", NonNullStep<Get<"Post", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Datetime", "nullable", Step>>>;
        id?: FieldPlan<Get<"Post", "source", NonNullStep<Get<"Post", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
      }
    };
    Query?: Omit<ObjectPlan<Get<"Query", "source", NonNullStep<Get<"Query", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        posts?: FieldPlan<Get<"Query", "source", NonNullStep<Get<"Query", "nullable", Step>>>, NoArguments, Get<"Post", "list", ListOfStep<Get<"Post", "nullable", Step>>>>;
        users?: FieldPlan<Get<"Query", "source", NonNullStep<Get<"Query", "nullable", Step>>>, NoArguments, Get<"User", "list", ListOfStep<Get<"User", "nullable", Step>>>>;
      }
    };
    User?: Omit<ObjectPlan<Get<"User", "source", NonNullStep<Get<"User", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        createdAt?: FieldPlan<Get<"User", "source", NonNullStep<Get<"User", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Datetime", "nullable", Step>>>;
        id?: FieldPlan<Get<"User", "source", NonNullStep<Get<"User", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
        posts?: FieldPlan<Get<"User", "source", NonNullStep<Get<"User", "nullable", Step>>>, NoArguments, Get<"Post", "list", ListOfStep<Get<"Post", "nullable", Step>>>>;
        username?: FieldPlan<Get<"User", "source", NonNullStep<Get<"User", "nullable", Step>>>, NoArguments, NonNullStep<Get<"String", "nullable", Step>>>;
      }
    };
  }
  interfaces?: {
  }
  unions?: {
  }
  inputObjects?: {
  }
  scalars?: {
    Datetime?: ScalarPlan;
  }
  enums?: {
  }
};

export function typedMakeGrafastSchema(spec: TypedGrafastSchemaSpec) {
  return makeGrafastSchema(spec);
}
