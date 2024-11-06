import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';
import {sportsbetPreferencesQuery} from '../graphqls/SportsbetPreferences.js';
import {PreferencesQuery} from "../graphqls/PreferencesQuery.js";
import {LoginUserMutation} from "../graphqls/LoginUser.js";
import {TakeOwnershipOfBetSlipMutation} from "../graphqls/TakeOwnershipOfBetSlip.js";
import {BetslipQuery} from "../graphqls/BetslipQuery.js";
import {UpcomingRegionCategoriesQuery} from "../graphqls/UpcomingRegionCategoriesQuery.js";
import {DesktopAsianEventListPreviewQuery} from "../graphqls/DesktopAsianEventListPreviewQuery.js";
import {AddSelectionToBetslipMutation} from "../graphqls/AddSelectionToBetslipMutation.js";
import {UpdateSingleBetslipStakeMutation} from "../graphqls/UpdateSingleBetslipStakeMutation.js";
import {PlaceBetSingleBetsMutation} from "../graphqls/PlaceBetSingleBetsMutation.js";

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
const site = __ENV.SITE || 'sportsbet';

// Declare global variables for reuse
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
const requestVariables = {
    PreferencesQuery : {
        variables: {
            site : site,
            userPreferenceId : SportsbetPreferencesUserPreference
        },
    },
    LoginUser : {
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
        variables: {
            token : authToken,
            betslipId : SportsbetPreferencesBetslip,
            userPreferenceId : SportsbetPreferencesUserPreference
        },
    },
    BetslipQuery : {
        variables: {
            language : 'en',
            site : site,
            betslipId : SportsbetPreferencesBetslip
        },
    },
    UpcomingRegionCategoriesQuery : {
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
        variables: {
            language : 'en',
            site : site,
            tournamentId : tournamentId,
            childType : 'TODAY',
            cricketIncluded : false
        },
    },
    AddSelectionToBetslipMutation : {
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
        variables: {
            language : 'en',
            input: {
                stake : '1000',
                selectionId : selectionId,
                id : SportsbetNewGraphqlBetslip
            }
        },
    },
    PlaceBetSingleBetsMutation : {
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
                    id : selectionId,
                    odds : odds,
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
    requestVariables.PreferencesQuery.variables.userPreferenceId = SportsbetPreferencesUserPreference;

    // Step 2: Preferences Query -----------------------------------------------------------------------
    let preferencesQuery = http.post(`${BASE_URL}`, JSON.stringify({
        query: PreferencesQuery,
        variables : requestVariables.PreferencesQuery.variables
    }), {
        headers: { 'Content-Type': 'application/json' },
    });
    SportsbetPreferencesBetslip = preferencesQuery.json('data.sportsbetPreferences.getUserPreferencesById.betslipId');
    check(preferencesQuery, {
        'PreferencesQuery query responded with status 200': (r) => r.status === 200,
        'SportsbetPreferencesBetslip Id received': () => SportsbetPreferencesBetslip !== undefined,
    });
    successCounter.add(1);
    requestVariables.BetslipQuery.variables.betslipId = SportsbetPreferencesBetslip;

    // Step 3: LoginUser Query -----------------------------------------------------------------------
    let loginUserQuery = http.post(`${BASE_URL}`, JSON.stringify({
        query: LoginUserMutation,
        variables: requestVariables.LoginUser.variables
    }), {
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
    requestVariables.TakeOwnershipOfBetSlip.variables.token = authToken;
    requestVariables.TakeOwnershipOfBetSlip.variables.userPreferenceId = SportsbetPreferencesUserPreference;
    requestVariables.TakeOwnershipOfBetSlip.variables.betslipId = SportsbetPreferencesBetslip;

    // Step 4: TakeOwnershipOfBetSlip Query -----------------------------------------------------------------------
    let takeOwnershipOfBetslip = http.post(`${BASE_URL}`, JSON.stringify({
        query: TakeOwnershipOfBetSlipMutation,
        variables: requestVariables.TakeOwnershipOfBetSlip.variables
    }), {
        headers: headers,
    });
    check(takeOwnershipOfBetslip, {
        'TakeOwnershipOfBetSlip query responded with status 200': (r) => r.status === 200,
    });
    successCounter.add(1);
    requestVariables.BetslipQuery.variables.betslipId = SportsbetPreferencesBetslip;

    // Step 5: Betslip Query -----------------------------------------------------------------------
    let betslipQuery = http.post(`${BASE_URL}`, JSON.stringify({
        query: BetslipQuery,
        variables: requestVariables.BetslipQuery.variables
    }), {
        headers: headers,
    });
    SportsbetNewGraphqlBetslip = betslipQuery.json('data.sportsbetNewGraphql.getBetslipById.id');
    check(betslipQuery, {
        'Betslip query responded with status 200': (r) => r.status === 200,
        'SportsbetNewGraphqlBetslip Id received': () => SportsbetNewGraphqlBetslip !== undefined,
    });
    successCounter.add(1);

    // Step 5: UpcomingRegionCategories Query -----------------------------------------------------------------------
    let upcomingRegionCategoriesQuery = http.post(`${BASE_URL}`, JSON.stringify({
        query: UpcomingRegionCategoriesQuery,
        variables: requestVariables.UpcomingRegionCategoriesQuery.variables
    }), {
        headers: headers,
    });
    tournamentId = upcomingRegionCategoriesQuery.json('data.sportsbetNewGraphql.region.sports.0.leagues.0.tournaments.0.id');
    check(upcomingRegionCategoriesQuery, {
        'UpcomingRegionCategories query responded with status 200': (r) => r.status === 200,
        'Upcoming Tournament 01 Id received': () => tournamentId !== undefined,
    });
    successCounter.add(1);
    requestVariables.DesktopAsianEventListPreviewQuery.variables.tournamentId = tournamentId;

    // Step 6: DesktopAsianEventListPreview Query -----------------------------------------------------------------------
   let desktopAsianEventListPreviewQuery = http.post(`${BASE_URL}`, JSON.stringify({
       query: DesktopAsianEventListPreviewQuery,
       variables: requestVariables.DesktopAsianEventListPreviewQuery.variables
   }), {
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

    requestVariables.AddSelectionToBetslipMutation.variables.input.preferenceId = SportsbetPreferencesUserPreference;
    requestVariables.AddSelectionToBetslipMutation.variables.input.id = SportsbetNewGraphqlBetslip;
    requestVariables.AddSelectionToBetslipMutation.variables.input.betId = SportsbetNewGraphqlBetslipBet;
    requestVariables.AddSelectionToBetslipMutation.variables.input.selection.id = SportsbetNewGraphqlBetslipBetSelection;
    requestVariables.AddSelectionToBetslipMutation.variables.input.selection.odds = odds;
    requestVariables.AddSelectionToBetslipMutation.variables.input.selection.eventId = eventId;
    requestVariables.AddSelectionToBetslipMutation.variables.input.selection.marketId = marketId;
    requestVariables.AddSelectionToBetslipMutation.variables.input.selection.selectionId = selectionId;

    // Step 7: AddSelectionToBetslipMutation Query -----------------------------------------------------------------------
   let addSelectionToBetslipMutation = http.post(`${BASE_URL}`, JSON.stringify({
       query: AddSelectionToBetslipMutation,
       variables: requestVariables.AddSelectionToBetslipMutation.variables
   }), {
        headers: headers,
    });
    betslipId = addSelectionToBetslipMutation.json('data.sportsbetNewGraphqlAddSelectionToBetslip.betslip.id')
    check(addSelectionToBetslipMutation, {
        'AddSelectionToBetslipMutation query responded with status 200': (r) => r.status === 200,
        'Selection added Betslip Id received': () => betslipId !== undefined,
    });
    successCounter.add(1);
    requestVariables.UpdateSingleBetslipStakeMutation.variables.input.selectionId = selectionId;
    requestVariables.UpdateSingleBetslipStakeMutation.variables.input.id = SportsbetNewGraphqlBetslip;

    // Step 8: UpdateSingleBetslipStakeMutation Query -----------------------------------------------------------------------
   let updateSingleBetslipStakeMutation = http.post(`${BASE_URL}`, JSON.stringify({
       query: UpdateSingleBetslipStakeMutation,
       variables: requestVariables.UpdateSingleBetslipStakeMutation.variables
   }), {
        headers: headers,
    });
    betslipId = updateSingleBetslipStakeMutation.json('data.sportsbetNewGraphqlUpdateSingleBetslipStake.betslip.id')
    check(updateSingleBetslipStakeMutation, {
        'UpdateSingleBetslipStakeMutation query responded with status 200': (r) => r.status === 200,
        'UpdateSingleBetslipStakeMutation has data': (r) => r.json('data') !== null,
        'Updated Single Betslip Id received': () => betslipId !== undefined,
    });
    successCounter.add(1);
    requestVariables.PlaceBetSingleBetsMutation.variables.input.betslipId = SportsbetNewGraphqlBetslip;
    requestVariables.PlaceBetSingleBetsMutation.variables.input.selections.id = selectionId;
    requestVariables.PlaceBetSingleBetsMutation.variables.input.selections.odds = odds;


    // Step 9: PlaceBetSingleBetsMutation Query -----------------------------------------------------------------------
    let placeBetSingleBetsMutation = http.post(`${BASE_URL}`, JSON.stringify({
        query: PlaceBetSingleBetsMutation,
        variables: requestVariables.PlaceBetSingleBetsMutation.variables
    }), {
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
