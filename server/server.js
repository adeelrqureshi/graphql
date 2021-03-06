const express = require('express');
const {ApolloServer} = require('apollo-server-express');

const authors = [
    {
        id: '1',
        info:{
            name: 'Joe Kelley',
            age: 32,
            gender: 'M'
        }
    },
    {
        id: '2',
        info:{
            name: 'Mary Jane',
            age: 27,
            gender: 'F'
        }
    }
]

const typeDefs = `
    type Author {
        id: ID!
        info: Person
    }

    type Person {
        name: String!
        age: Int
        gender: String
    }

    type Query{
        getAuthors: [Author]
        retrieveAuthor(id: ID!) : Author
    }

    type Mutation{
        createAuthor (name: String! , gender: String! ): Author
    }
`;

const resolvers = {
    Query:{
        getAuthors : () => authors,
        retrieveAuthor: (obj,{id}) => authors.find(author => author.id === id)

    },

    Mutation:{
        createAuthor : (obj,args)=> {
            const id = String(authors.length + 1);
            const {name, gender} = args;

            const newAuthor = {
                id,
                info: {
                    name,
                    gender
                }
            }

            authors.push(newAuthor);
            return newAuthor;
        }
    }
};


const PORT=3600;

const server = new ApolloServer({typeDefs, resolvers});

const app = express();

server.applyMiddleware ({
    app,
    path: '/graphql'
});

/*app.use('/graphql',(req,res)=> {
    res.send('Welcome to Authors app');
}); */

app.listen(PORT , () => {
    console.log(`Server running on port http://localhost:${PORT}${server.graphqlPath}`);
});