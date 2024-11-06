export const AddSelectionToBetslipMutation = `
mutation AddSelectionToBetslipMutation($input: SportsbetNewGraphqlAddSelectionToBetslipInput!, $language: String!) {
            __typename
            sportsbetNewGraphqlAddSelectionToBetslip(input: $input) {
                errors {
                    __typename
                    message
                    code
                    params {
                        __typename
                        name
                        value
                    }
                }
                betslip {
                    ...BetslipFragment
                    __typename
                }
                __typename
            }
        }
        
        fragment BetslipFragment on SportsbetNewGraphqlBetslip {
            __typename
            id
            userId
            active
            type
            stake
            currencyCode
            insuranceActive
            isEligibleForMultibetEnsurance
            __typename
            bets {
                __typename
                id
                freeBetId
                selections {
                    __typename
                    id
                    marketId
                    selectionId
                    eventId
                    betBoostTemplateId
                    stake
                    odds
                    EW
                    __typename
                    event {
                        __typename
                        id
                        name(language: $language)
                        enName: name(language: "en")
                        status
                        maxBetAvailable
                        information {
                            __typename
                            id
                            customEventId
                            allowCustomEventMultibets
                        }
                        providerId
                        slug
                        sport {
                            __typename
                            id
                            slug
                            betBoostMultiplier
                            viewType
                        }
                        tournament {
                            __typename
                            id
                            slug
                            betBoostMultiplier
                        }
                        league {
                            __typename
                            id
                            slug
                            betBoostMultiplier
                        }
                        racingEventInfo {
                            __typename
                            id
                            eventNumber
                            trackName
                        }
                    }
                    market {
                        __typename
                        id
                        name(language: $language)
                        enName: name(language: "en")
                        status
                        marketFeatures
                        selections {
                            __typename
                            id
                            name(language: $language)
                            active
                        }
                        market_type {
                            __typename
                            id
                            settings {
                                __typename
                                id
                                betBoostMultiplier
                            }
                        }
                    }
                    selection {
                        __typename
                        id
                        odds
                        name(language: $language)
                        active
                        providerProductId
                    }
                }
            }
        }
`;