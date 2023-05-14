import mongoose from 'mongoose';
import { graphql } from 'graphql';
import { resolvers } from './resolvers';
import authChecker from './utils/authChecker';

import { buildSchema } from 'type-graphql';

export const teardown = async function () {
  //   await UserModel.deleteMany({});
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.log(error);
  }
};

export const graphqlTestCall = async (
  query: any,
  variables?: any,
  authorization?: string
) => {
  const schema = await buildSchema({
    resolvers,
    authChecker, // will submit authroized error if context.user is null
  });

  return graphql(
    schema,
    query,
    undefined,
    // context
    {
      req: {
        headers: {
          authorization,
        },
      },
    },
    variables
  );
};
