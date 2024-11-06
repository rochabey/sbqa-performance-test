export const DesktopAsianEventListPreviewQuery = `
query DesktopAsianEventListPreviewQuery($language: String!, $tournamentId: GraphqlId!, $childType: SportsbetNewGraphqlTournamentEvents!, $cricketIncluded: Boolean!) {
            sportsbetNewGraphql {
                id
                getTournamentById(id: $tournamentId) {
                    id
                    events(childType: $childType) {
                        ...DesktopAsianEventFragment
                        __typename
                    }
                    __typename
                }
                __typename
            }
        }
        
        fragment DesktopAsianEventFragment on SportsbetNewGraphqlEvent {
            id
            __typename
            asian {
                id
                __typename
                ftMatchWinner {
                    ...EventListMarketQueryFragment
                    __typename
                }
                ftTotal {
                    ...EventListMarketQueryFragment
                    __typename
                }
                ftHandicap {
                    ...EventListMarketQueryFragment
                    __typename
                }
                htTotal {
                    ...EventListMarketQueryFragment
                    __typename
                }
                htHandicap {
                    ...EventListMarketQueryFragment
                    __typename
                }
                htMatchWinner {
                    ...EventListMarketQueryFragment
                    __typename
                }
            }
            ...EventListInformationQueryFragment
        }
        
        fragment EventListMarketQueryFragment on SportsbetNewGraphqlMarket {
            id
            __typename
            enName: name(language: "en")
            name(language: "en")
            status
            specifiers
            selections {
                id
                __typename
                enName: name(language: "en")
                name(language: $language)
                active
                odds
                providerProductId
                competitorType
            }
            market_type {
                id
                __typename
                name
                description
                translation_key
                type
                settings {
                    id
                    betBoostMultiplier
                    __typename
                }
            }
        }
        
        fragment EventListInformationQueryFragment on SportsbetNewGraphqlEvent {
            id
            __typename
            type
            status
            start_time
            market_count
            live_odds
            slug
            name(language: $language)
            enName: name(language: "en")
            maxBetAvailable
            videoStream {
                id
                __typename
                streamAvailable
            }
            sport {
                id
                __typename
                slug
                name(language: $language)
                betBoostMultiplier
                iconCode
                viewType
            }
            league {
                id
                __typename
                slug
                name(language: $language)
                betBoostMultiplier
            }
            tournament {
                id
                __typename
                slug
                name(language: $language)
                betBoostMultiplier
            }
            competitors {
                id
                __typename
                name(language: $language)
                enName
                type
                betradarId
            }
            information {
                id
                __typename
                match_time
                provider_prefix
                period_scores {
                    id
                    __typename
                    home_score
                    away_score
                }
                match_status_translations(language: $language)
                home_score
                away_score
                home_gamescore
                away_gamescore
                provider_product_id
            }
            premiumCricketScoringData @include(
                if: $cricketIncluded) {
                ...CricketStatsFragment
                __typename
            }
            isSportcastFixtureActive
            sportcastFixtureId
            kerosports {
                isPublished
                gameId
                __typename
            }
        }
        
        fragment CricketStatsFragment on SportsbetNewGraphqlPremiumCricketScore {
            id
            matchTitle
            matchCommentary
            battingTeam {
                id
                teamWickets
                teamRuns
                teamOvers
                teamName
                sixes
                fours
                __typename
            }
            previousInnings {
                id
                wickets
                teamName
                runs
                oversAvailable
                overs
                inningsNumber
                competitorId
                __typename
            }
            overs {
                id
                runs
                overNumber
                isCurrentOver
                balls
                __typename
            }
            batsmen {
                sixes
                runs
                onStrike
                fours
                batsmanName
                balls
                active
                __typename
            }
            __typename
        }
`;