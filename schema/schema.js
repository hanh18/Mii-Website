import { gql } from 'apollo-server-express';

// (type definition) denfinition type of graphql
const typeDefs = gql`
    type User {
        id: ID!,
        email: String,
        name: String,
    }

    # ROOT TYPE: nơi đặt ra yêu cầu truy xuất dữ liệu
    # book (id: ID!): Book --> tham số
    type Query {
        users: [User]
    }


    #MUTATION
    # ghi dữ liệu vào server
    type Mutation {
        login(
            data: LoginUserInput!
        ): AuthPayLoad!
        createUser(
            name: String,
            email: String
        ) : AuthPayLoad
    }

    #AUTHOR
    type AuthPayLoad {
        token: String!
        user: User!
    }

    #input
    input LoginUserInput {
        email: String!,
        name: String!
    }
`;

export default typeDefs;
