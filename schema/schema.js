import { gql } from 'apollo-server-express';

// (type definition) denfinition type of graphql
const typeDefs = gql`
    type User {
        id: ID!,
        username: String,
        password: String,
        email: String,
        fullName: String,
        gender: String,
        dateOfBirth: String,
        address: String,
        phone: String,
        avatar: String,
        validToken: String,
        isActive: Boolean,
        isBlock: Boolean,
        createAt: String,
        updateAt: String
    }

    # ROOT TYPE: nơi đặt ra yêu cầu truy xuất dữ liệu
    # book (id: ID!): Book --> tham số
    type Query {
        users: [User]
        user: User
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

    #input of login
    input LoginUserInput {
        username: String!,
        password: String!
    }
`;

export default typeDefs;
