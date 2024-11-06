export const PlaceBetSingleBetsMutation = `
mutation PlaceBetSingleBetsMutation($input: SportsbetTicketsCreateSingleBetsInput!, $language: String!) {
            sportsbetTicketsPlaceSingleBets(input: $input) {
                errors {
                    message
                    code
                    params {
                        name
                        value
                        __typename
                    }
                    __typename
                }
                betErrors {
                    message
                    code
                    params {
                        name
                        value
                        __typename
                    }
                    __typename
                }
                tickets {
                    ...TicketFragment
                    __typename
                }
                __typename
            }
        }
        
        fragment TicketFragment on SportsbetTicketsTicket {
            id
            __typename
            status
            won_amount
            placed_at
            stake_amount
            max_win
            alternative_stake
            odds
            boosted_odds
            boosted_ticket
            bet_type
            multiboost
            insuranceActive
            bets {
                id
                __typename
                amount
                total_odds
                cashback_percent
                selections {
                    id
                    __typename
                    event_id
                    status
                    void_factor
                    boosted_odds
                    odds
                    market_name(language: $language)
                    enName: market_name(language: "en")
                    event_start_time
                    event_score
                    event_type
                    selection_id
                    name(language: $language)
                    event_name(language: $language)
                    provider_product_id
                    sport {
                        id
                        __typename
                        iconCode
                        scoreType
                    }
                    market {
                        id
                        selections {
                            id
                            name(language: $language)
                            odds
                            active
                            __typename
                        }
                        __typename
                    }
                }
                free_bet
            }
            cashout {
                id
                __typename
                instances {
                    __typename
                    performedAt
                    amount
                    type
                    paidAmount
                    oddsAtCashout
                }
            }
            currencyCode
            racingMeta {
                selectionId
                track
                raceNumber
                __typename
            }
        }
`;