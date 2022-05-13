import {gql} from "apollo-server";

export const typeDefs = gql`
    type City {
        guid: String!
        isActive: Boolean!
        address: String!
        latitude: Float!
        longitude: Float!
        tags: [String!]!
    }
    
    type Distance {
        from: String!
        to: String!
        unit: String!
        distance: Float!
    }
    
    type Query {
        allCities: [City!]!
        citiesByTag(tag: String!, isActive: Boolean!): [City!]!
        distance(from: String!, to: String!): Distance!
        triggerAreaCalculation(from: String!, to: String!): String!
        areaResult(id: String!): [City!]!
    }
`