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
        ) : AuthPayLoad!
        createUser(
            data: RegisterInput!
        ) : Token
    }

    #CUSTOMIZE DATATYPE
    #AUTHOR
    type AuthPayLoad {
        token: String!
        user: User!
    }

    #token 
    type Token {
        token: String!
    }


    #INPUT
    #input of login
    input LoginUserInput {
        username: String!,
        password: String!
    }

    #input of register
    input RegisterInput {
        username: String!,
        password: String!,
        email: String!
    }
`;

export default typeDefs;
