export const sportsbetPreferencesQuery =
    `{
          sportsbetPreferences {
              getUserPreferencesById(id: "", site: "sportsbet") {
                  id
              }
          }
      }
    `;