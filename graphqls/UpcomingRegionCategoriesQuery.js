export const UpcomingRegionCategoriesQuery = `
query UpcomingRegionCategoriesQuery($language: String!, $childType: SportsbetNewGraphqlSportLeagues!, $regionChildType: SportsbetNewGraphqlRegionSports!, $featuredLeagueTournaments: SportsbetNewGraphqlFeaturedLeagueTournaments!, $leagueTournaments: SportsbetNewGraphqlLeagueTournaments!, $tournamentEventCount: SportsbetNewGraphqlTournamentEventCount!, $sportEventCountType: SportsbetNewGraphqlSportEventCount!, $site: String) {
            sportsbetNewGraphql {
                id
                region {
                    id
                    name
                    sports(childType: $regionChildType, sportType: WITHRACING, site: $site) {
                        slug
                        viewType
                        featuredLeague {
                            id
                            name(language: $language)
                            tournaments(childType: $featuredLeagueTournaments) {
                                id
                                slug
                                name(language: $language)
                                eventCount(childType: $tournamentEventCount)
                                league {
                                    id
                                    slug
                                    name(language: $language)
                                    __typename
                                }
                                __typename
                            }
                            __typename
                        }
                        leagues(childType: $childType, site: $site) {
                                id
                                name(language: $language)
                                slug
                                tournaments(childType: $leagueTournaments, site: $site) {
                                    id
                                    slug
                                    name(language: $language)
                                    eventCount(childType: $tournamentEventCount)
                                    __typename
                                }
                                __typename
                            }
                            ...SportCategory
                        __typename
                    }
                    __typename
                }
                __typename
            }
        }
        
        fragment SportCategory on SportsbetNewGraphqlSport {
            id
            name(language: $language)
            eventCount(childType: $sportEventCountType)
            iconCode
            slug
            __typename
        }
`;