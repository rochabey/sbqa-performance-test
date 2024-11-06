export const SportsbetPreferencesQuery =
    `{
          sportsbetPreferences {
              getUserPreferencesById(id: "", site: "sportsbet") {
                  id
              }
          }
      }
    `;