import { gql } from '@apollo/client';

export const GET_ENTRIES = gql`
  query GetEntries {
    getEntries {
      id
      foodName
      calories
      date
      createdAt
    }
  }
`;

export const ADD_ENTRY = gql`
  mutation AddEntry($foodName: String!, $calories: Int!) {
    addEntry(foodName: $foodName, calories: $calories) {
      id
      foodName
      calories
      date
    }
  }
`;
