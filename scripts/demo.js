import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';
import {sportsbetPreferencesQuery} from '../graphqls/SportsbetPreferences.js';

// Define custom metrics to count successful responses
let successCounter = new Counter("successful_requests");

export let options = {
    // vus: 1, // Virtual users
    // duration: '30s', // Test duration
    thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    },
    scenarios: {
        singleBetPlacement: {
            executor: 'constant-arrival-rate',
            duration: '30s', // total duration
            preAllocatedVUs: 10, // to allocate runtime resources     preAll
            rate: 10, // number of constant iterations given `timeUnit`
            timeUnit: '1s',
        },
    },
};

//Declare baseUrl for the test
const BASE_URL = __ENV.BASE_URL || 'https://staging.sportsbet.io/graphql';

// Declare global variables for reuse
let site = 'sportsbet';
let SportsbetPreferencesUserPreference = '';
let SportsbetPreferencesBetslip = '';
let SportsbetNewGraphqlBetslip = '';
let authToken = '';
let SportsbetNewGraphqlBetslipBet = '';
let SportsbetNewGraphqlBetslipBetSelection = '';
let betslipId = '';
let tournamentId = '';
let eventId = '';
let marketId = '';
let selectionId = '';
let odds = '';
let betslipBetId = '';
let betslipBetSelectionId = '';



// Define GraphQL queries and mutations
const queries = {
    PreferencesQuery : {
        query: `
        query PreferencesQuery($userPreferenceId: ID, $site: String) {
          sportsbetPreferences {
              id
              getUserPreferencesById(id: $userPreferenceId, site: $site) {
                  id
                  language
                  currency
                  wallets
                  colorScheme
                  btcDisplayType
                  acceptOddsChanges
                  acceptOddsFluctuations
                  quickBet
                  betslipId
                  forgetBetslip
                  oddsFormat
                  receiveMarketingEmail
                  receiveMarketingSms
                  refCode
                  cid
                  refAff
                  viewType
                  videoNotificationsDisabled
                  __typename
              }
              __typename
          }
      }
        `,
        variables: {
            site : site,
            userPreferenceId : SportsbetPreferencesUserPreference
        },
    },
    LoginUser : {
        query: `
      mutation LoginUser($username: String!, $password: String!, $captcha: String!, $captchaVersion: String, $otp: String!, $brand: String, $site: String, $authClearanceId: String) {
          userManagementLoginViaPassword(
              input: {
                  site: $site,
                  username: $username,
                  password: $password,
                  captcha: $captcha,
                  captchaVersion: $captchaVersion,
                  otp: $otp,
                  brand: $brand,
                  authClearanceId: $authClearanceId
              }
          ) {
              sessionId
              token
              errors {
                  code
                  message
                  params {
                      name
                      value
                      __typename
                  }
                  __typename
              }
              __typename
          }
      }
       `,
        variables: {
            username : 'rochelle_test',
            password : 'Qaqaqa@1',
            authClearanceId : '',
            site : site,
            captcha : '',
            captchaVersion : 'v3',
            otp : '',
            brand : site
        },
    },
    TakeOwnershipOfBetSlip : {
        query: `
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
        `,
        variables: {
            token : authToken,
            betslipId : SportsbetPreferencesBetslip,
            userPreferenceId : SportsbetPreferencesUserPreference
        },
    },
    BetslipQuery : {
        query: `
        query BetslipQuery($betslipId: GraphqlId!, $language: String!) {
            sportsbetNewGraphql {
                id
                getBetslipById(id: $betslipId) {
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
        `,
        variables: {
            language : 'en',
            site : site,
            betslipId : SportsbetPreferencesBetslip
        },
    },
    UpcomingRegionCategoriesQuery : {
        query: `
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
    `,
        variables: {
            language : 'en',
            site : site,
            childType : 'TODAY',
            regionChildType : 'TODAY',
            leagueEventCountType : 'TODAY',
            sportEventCountType : 'TODAY',
            featuredTournamentsChildType : 'TODAY',
            leagueTournaments : 'TODAY',
            tournamentEventCount : 'TODAY',
            featuredLeagueTournaments : 'TODAY'
        },
    },
    DesktopAsianEventListPreviewQuery : {
        query: `
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
        `,
        variables: {
            language : 'en',
            site : site,
            tournamentId : tournamentId,
            childType : 'TODAY',
            cricketIncluded : false
        },
    },
    AddSelectionToBetslipMutation : {
        query: `
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
        `,
        variables: {
            language : 'en',
            input : {
                preferenceId : SportsbetPreferencesUserPreference,
                site : site,
                id : SportsbetNewGraphqlBetslip,
                betId : SportsbetNewGraphqlBetslipBet,
                selection : {
                    stake : '0',
                    id : SportsbetNewGraphqlBetslipBetSelection,
                    odds : odds,
                    eventId : eventId,
                    marketId : marketId,
                    selectionId : selectionId,
                    providerProductId : '997'
                }
            }
        },
    },
    UpdateSingleBetslipStakeMutation : {
        query: `
        mutation UpdateSingleBetslipStakeMutation($input: SportsbetNewGraphqlUpdateSingleBetslipStakeInput!, $language: String!) {
            sportsbetNewGraphqlUpdateSingleBetslipStake(input: $input) {
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
       `,
        variables: {
            language : 'en',
            input: {
                stake : '1000',
                selectionId : '',
                id : SportsbetNewGraphqlBetslip
            }
        },
    },
    PlaceBetSingleBetsMutation : {
        query: `
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
        `,
        variables: {
            language : 'en',
            input : {
                os : 'MacIntel',
                device : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
                site : site,
                requestId : '64c178183bb88ed332b5a1379d858488',
                currencyCode : 'BTC',
                locale : 'en',
                betslipId : SportsbetNewGraphqlBetslip,
                selections : {
                    id : '',
                    odds : '',
                    betBoostTemplateId : null,
                    amount : 1000,
                    freeBetId : null,
                    providerProductId : '997',
                    type : 'DEFAULT'
                }
            }
        },
    },
}

// Function to generate a UUIDv4
function generateUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// Custom UTF-8 encoding function
function utf8Encode(str) {
    const utf8 = [];
    for (let i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i);
        if (charCode < 0x80) utf8.push(charCode);
        else if (charCode < 0x800) {
            utf8.push(0xc0 | (charCode >> 6));
            utf8.push(0x80 | (charCode & 0x3f));
        } else if (charCode < 0x10000) {
            utf8.push(0xe0 | (charCode >> 12));
            utf8.push(0x80 | ((charCode >> 6) & 0x3f));
            utf8.push(0x80 | (charCode & 0x3f));
        } else {
            utf8.push(0xf0 | (charCode >> 18));
            utf8.push(0x80 | ((charCode >> 12) & 0x3f));
            utf8.push(0x80 | ((charCode >> 6) & 0x3f));
            utf8.push(0x80 | (charCode & 0x3f));
        }
    }
    return utf8;
}

// Custom Base64 encoding function
function encodeBase64(byteArray) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let encoded = '';
    let i = 0;

    while (i < byteArray.length) {
        const b1 = byteArray[i++];
        const b2 = byteArray[i++];
        const b3 = byteArray[i++];

        const e1 = b1 >> 2;
        const e2 = ((b1 & 3) << 4) | (b2 >> 4);
        const e3 = ((b2 & 15) << 2) | (b3 >> 6);
        const e4 = b3 & 63;

        if (isNaN(b2)) {
            encoded += chars.charAt(e1) + chars.charAt(e2) + '==';
        } else if (isNaN(b3)) {
            encoded += chars.charAt(e1) + chars.charAt(e2) + chars.charAt(e3) + '=';
        } else {
            encoded += chars.charAt(e1) + chars.charAt(e2) + chars.charAt(e3) + chars.charAt(e4);
        }
    }

    return encoded;
}

// Function to convert a database ID to a GraphQL ID with Base64 encoding
function toGraphqlId(databaseId, prefix) {
    const str = `${prefix}:${databaseId}`;
    const utf8Bytes = utf8Encode(str); // Convert string to UTF-8 byte array
    return encodeBase64(utf8Bytes);    // Encode to Base64
}

export default function () {

    // Step 1: Sportsbet Preferences  -----------------------------------------------------------------------
    let sportsbetPreferences = http.post(`${BASE_URL}`, JSON.stringify({
        query: sportsbetPreferencesQuery,
        variables: {} }),
        {headers: { 'Content-Type': 'application/json' },
    });
    SportsbetPreferencesUserPreference = sportsbetPreferences.json('data.sportsbetPreferences.getUserPreferencesById.id');
    check(sportsbetPreferences, {
        'SportsbetPreferences query responded with status 200': (r) => r.status === 200,
        'SportsbetPreferencesUserPreference Id received': () => SportsbetPreferencesUserPreference !== undefined,
    });
    successCounter.add(1);
    queries.PreferencesQuery.variables.userPreferenceId = SportsbetPreferencesUserPreference;

    // Step 2: Preferences Query -----------------------------------------------------------------------
    let preferencesQuery = http.post(`${BASE_URL}`, JSON.stringify(queries.PreferencesQuery), {
        headers: { 'Content-Type': 'application/json' },
    });
    SportsbetPreferencesBetslip = preferencesQuery.json('data.sportsbetPreferences.getUserPreferencesById.betslipId');
    check(preferencesQuery, {
        'PreferencesQuery query responded with status 200': (r) => r.status === 200,
        'SportsbetPreferencesBetslip Id received': () => SportsbetPreferencesBetslip !== undefined,
    });
    successCounter.add(1);
    queries.BetslipQuery.variables.betslipId = SportsbetPreferencesBetslip;

    // Step 3: LoginUser Query -----------------------------------------------------------------------
    let loginUserQuery = http.post(`${BASE_URL}`, JSON.stringify(queries.LoginUser), {
        headers: { 'Content-Type': 'application/json' },
    });
    authToken = 'Bearer ' + loginUserQuery.json('data.userManagementLoginViaPassword.token');
    check(loginUserQuery, {
        'LoginUser query responded with status 200': (r) => r.status === 200,
        'AuthToken received': () => authToken !== undefined,
    });
    successCounter.add(1);
    // Set authorization header for subsequent requests using global authToken
    let headers = {
        'Content-Type': 'application/json',
        Authorization: authToken,
    };
    queries.TakeOwnershipOfBetSlip.variables.token = authToken;
    queries.TakeOwnershipOfBetSlip.variables.userPreferenceId = SportsbetPreferencesUserPreference;
    queries.TakeOwnershipOfBetSlip.variables.betslipId = SportsbetPreferencesBetslip;

    // Step 4: TakeOwnershipOfBetSlip Query -----------------------------------------------------------------------
    let takeOwnershipOfBetslip = http.post(`${BASE_URL}`, JSON.stringify(queries.TakeOwnershipOfBetSlip), {
        headers: headers,
    });
    check(takeOwnershipOfBetslip, {
        'TakeOwnershipOfBetSlip query responded with status 200': (r) => r.status === 200,
    });
    successCounter.add(1);
    queries.BetslipQuery.variables.betslipId = SportsbetPreferencesBetslip;

    // Step 5: Betslip Query -----------------------------------------------------------------------
    let betslipQuery = http.post(`${BASE_URL}`, JSON.stringify(queries.BetslipQuery), {
        headers: headers,
    });
    SportsbetNewGraphqlBetslip = betslipQuery.json('data.sportsbetNewGraphql.getBetslipById.id');
    check(betslipQuery, {
        'Betslip query responded with status 200': (r) => r.status === 200,
        'SportsbetNewGraphqlBetslip Id received': () => SportsbetNewGraphqlBetslip !== undefined,
    });
    successCounter.add(1);

    // Step 5: UpcomingRegionCategories Query -----------------------------------------------------------------------
    let upcomingRegionCategoriesQuery = http.post(`${BASE_URL}`, JSON.stringify(queries.UpcomingRegionCategoriesQuery), {
        headers: headers,
    });
    tournamentId = upcomingRegionCategoriesQuery.json('data.sportsbetNewGraphql.region.sports.0.leagues.0.tournaments.0.id');
    check(upcomingRegionCategoriesQuery, {
        'UpcomingRegionCategories query responded with status 200': (r) => r.status === 200,
        'Upcoming Tournament 01 Id received': () => tournamentId !== undefined,
    });
    successCounter.add(1);
    queries.DesktopAsianEventListPreviewQuery.variables.tournamentId = tournamentId;

    // Step 6: DesktopAsianEventListPreview Query -----------------------------------------------------------------------
   let desktopAsianEventListPreviewQuery = http.post(`${BASE_URL}`, JSON.stringify(queries.DesktopAsianEventListPreviewQuery), {
        headers: headers,
    });
    eventId = desktopAsianEventListPreviewQuery.json('data.sportsbetNewGraphql.getTournamentById.events.0.id');
    marketId = desktopAsianEventListPreviewQuery.json('data.sportsbetNewGraphql.getTournamentById.events.0.asian.ftMatchWinner.0.id');
    selectionId = desktopAsianEventListPreviewQuery.json('data.sportsbetNewGraphql.getTournamentById.events.0.asian.ftMatchWinner.0.selections.0.id');
    odds = desktopAsianEventListPreviewQuery.json('data.sportsbetNewGraphql.getTournamentById.events.0.asian.ftMatchWinner.0.selections.0.odds');
    check(desktopAsianEventListPreviewQuery, {
        'DesktopAsianEventListPreview query responded with status 200': (r) => r.status === 200,
        'Upcoming Event Id received': () => eventId !== undefined,
        'Upcoming Market Id received': () => marketId !== undefined,
        'Upcoming Selection Id received': () => selectionId !== undefined,
        'Upcoming Odds received': () => odds !== undefined
    });
    successCounter.add(1);

    betslipBetId = generateUUIDv4();
    betslipBetSelectionId = generateUUIDv4();
    SportsbetNewGraphqlBetslipBet = toGraphqlId(betslipBetId, 'SportsbetNewGraphqlBetslipBet');
    SportsbetNewGraphqlBetslipBetSelection = toGraphqlId(betslipBetSelectionId, 'SportsbetNewGraphqlBetslipBetSelection');

    queries.AddSelectionToBetslipMutation.variables.input.preferenceId = SportsbetPreferencesUserPreference;
    queries.AddSelectionToBetslipMutation.variables.input.id = SportsbetNewGraphqlBetslip;
    queries.AddSelectionToBetslipMutation.variables.input.betId = SportsbetNewGraphqlBetslipBet;
    queries.AddSelectionToBetslipMutation.variables.input.selection.id = SportsbetNewGraphqlBetslipBetSelection;
    queries.AddSelectionToBetslipMutation.variables.input.selection.odds = odds;
    queries.AddSelectionToBetslipMutation.variables.input.selection.eventId = eventId;
    queries.AddSelectionToBetslipMutation.variables.input.selection.marketId = marketId;
    queries.AddSelectionToBetslipMutation.variables.input.selection.selectionId = selectionId;

    // Step 7: AddSelectionToBetslipMutation Query -----------------------------------------------------------------------
   let addSelectionToBetslipMutation = http.post(`${BASE_URL}`, JSON.stringify(queries.AddSelectionToBetslipMutation), {
        headers: headers,
    });
    betslipId = addSelectionToBetslipMutation.json('data.sportsbetNewGraphqlAddSelectionToBetslip.betslip.id')
    check(addSelectionToBetslipMutation, {
        'AddSelectionToBetslipMutation query responded with status 200': (r) => r.status === 200,
        'Selection added Betslip Id received': () => betslipId !== undefined,
    });
    successCounter.add(1);
    queries.UpdateSingleBetslipStakeMutation.variables.input.selectionId = selectionId;
    queries.UpdateSingleBetslipStakeMutation.variables.input.id = SportsbetNewGraphqlBetslip;

    // Step 8: UpdateSingleBetslipStakeMutation Query -----------------------------------------------------------------------
   let updateSingleBetslipStakeMutation = http.post(`${BASE_URL}`, JSON.stringify(queries.UpdateSingleBetslipStakeMutation), {
        headers: headers,
    });
    betslipId = updateSingleBetslipStakeMutation.json('data.sportsbetNewGraphqlUpdateSingleBetslipStake.betslip.id')
    check(updateSingleBetslipStakeMutation, {
        'UpdateSingleBetslipStakeMutation query responded with status 200': (r) => r.status === 200,
        'UpdateSingleBetslipStakeMutation has data': (r) => r.json('data') !== null,
        'Updated Single Betslip Id received': () => betslipId !== undefined,
    });
    successCounter.add(1);
    queries.PlaceBetSingleBetsMutation.variables.input.betslipId = SportsbetNewGraphqlBetslip;
    queries.PlaceBetSingleBetsMutation.variables.input.selections.id = selectionId;
    queries.PlaceBetSingleBetsMutation.variables.input.selections.odds = odds;


    // Step 9: PlaceBetSingleBetsMutation Query -----------------------------------------------------------------------
    let placeBetSingleBetsMutation = http.post(`${BASE_URL}`, JSON.stringify(queries.PlaceBetSingleBetsMutation), {
        headers: headers,
    });
    betslipId = placeBetSingleBetsMutation.json('data.sportsbetTicketsPlaceSingleBets.tickets.0.id')
    check(placeBetSingleBetsMutation, {
        'PlaceBetSingleBetsMutation query responded with status 200': (r) => r.status === 200,
        'PlaceBetSingleBetsMutation has data': (r) => r.json('data') !== null,
        'Placed Betslip Id received': () => betslipId !== undefined,
    });
    successCounter.add(1);

    // Pause between iterations
    sleep(1);
}
