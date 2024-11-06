export const TakeOwnershipOfBetSlipMutation = `
mutation TakeOwnershipOfBetSlip($betslipId: GraphqlId!, $token: String!, $userPreferenceId: GraphqlId!) {
          sportsbetNewGraphqlTakeOwnershipOfBetslip(
              input: {
                  id: $betslipId,
                  userJwtToken: $token,
                  userPreferenceId: $userPreferenceId
              }
          ) {
              errors {
                  message
                  code
                  __typename
              }
              betslip {
                  id
                  __typename
              }
              __typename
          }
      }
`;