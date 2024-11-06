export const LoginUserMutation = `
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
`;