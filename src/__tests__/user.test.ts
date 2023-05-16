import { graphqlTestCall, teardown } from '../test-setup';
import { connectToMongo } from '../utils/mongo';

const createUserMutation = `
mutation createUser(
  $input: CreateUserInput!
) {
  createUser(
    input: $input
  ) {
    _id
    name
    email
  }
}
`;

describe('User resolvers', () => {
  beforeAll(async () => {
    connectToMongo();
  });

  afterAll(async () => {
    await teardown();
  });

  it('creates new user', async () => {
    const unique = new Date().getTime();

    const user = {
      name: 'Ada Okoro',
      email: `ada${unique}@mail.com`,
      password: 'helloWorld',
    };

    const response = await graphqlTestCall(createUserMutation, { input: user });
    const errors: any = response.errors;
    console.log('errors', errors);
    console.log('response', response);
    // expect(errors[0].message).toContain('Email already in use');
    expect(response.data?.createUser.name).toBe('Ada Okoro');
  });
});
