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

    type Category {
        id: ID!
        name: String,   
        thumbnail: String
        description: String
    }

    type CategoryDetail {
        id: ID!
        name: String,   
        thumbnail: String
        description: String
        productQuantity: Int
    }

    type Product {
        id: ID!
        name: String
        price: String
        thumbnail: String
    }

    type ProductDetail {
        id: ID!
        name: String
        price: String
        amount: Int
        productImg: [ImageProduct]
    }

    type ImageProduct {
        link: String!
    }

    type Cart {
        id: ID!
        cartProduct: [CartProduct]
    }

    type CartProduct {
        id: ID!
        quantity: Int
        cartId: Int
        productId: Int
    }

    type ItemInCart {
        name: String
        thumbnail: String
        quantity: Int
        price: String
    }

    # ROOT TYPE: nơi đặt ra yêu cầu truy xuất dữ liệu
    # book (id: ID!): Book --> tham số
    type Query {
        user: User
        categories (sortName: String, sortProductQuantity: String): [Category]
        category (ID: Int): CategoryDetail
        products (sortName: String, sortPrice: String): [Product]
        productsFilter (categoryId: Int): [Product]
        product (ID: Int): ProductDetail
        cart: Cart
        itemsInCart: [ItemInCart]
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
        addToCart(
            data: AddToCart!
        ) : Message
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

    #input add to cart
    input AddToCart {
        productId: ID,
    }
`;

export default typeDefs;
