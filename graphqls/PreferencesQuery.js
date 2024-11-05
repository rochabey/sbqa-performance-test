export const PreferencesQuery =
    `query PreferencesQuery($userPreferenceId: ID, $site: String) {
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
`;