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
        birthday: String,
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
        forgotPassword(
            data: Email!
        ) : Message
        editUser(
            data: EditUser!
        ) : User
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

    #message
    type Message {
        message: String!
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

    #input email
    input Email {
        email: String!
    }

    #input edit user
    input EditUser {
        fullName: String,
        phone: String,
        birthday: String,
        gender: String,
        email: String,
        address: String
    }
`;

export default typeDefs;
