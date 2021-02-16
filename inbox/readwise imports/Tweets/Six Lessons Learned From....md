# Six Lessons Learned From...

- Author: @_alanbsmith on Twitter
- Full Title: Six Lessons Learned From...
- Category: #tweets
- URL: https://twitter.com/_alanbsmith/status/1360386773226950660
- Cover: ![](https://pbs.twimg.com/profile_images/1334379974149558275/aMhsM57Z.jpg)

### Highlights first exported February 16, 2021 at 5:15 PM

- Six lessons learned from building a composable Pagination component for ~2 months. 🧵 
  https://t.co/hiiJB5MuAi
    - **Note:** Save
- Composable > Configurable
  Always give consumers access to low-level semantic elements instead of top-level props. Enforcing markup structure with rigid components will only end up being more maintenance for you in the long run. Keep it flexible.
- Allow semantic html attributes on all low-level components
  If a component maps to a semantic element, allow those semantic attributes to be applied. You can make exceptions for className and style if you want (we don’t), but the rest is fair game. It also helps a11y and testing.
- Decouple state + behavior from UI elements
  Extract state and behavior into external hooks that components can consume. This decoupling allows UI elements to be completely interchangeable. Consumers can even create brand new, custom components. They can also create new behaviors.
- Build atomic behavioral hooks that can be composed
  Composable hooks are incredibly powerful way to share behavior across components. Users can use combinations within the provided components, or they can combine them in new ways to create their own components.
- Create a shared API across components
  A lot of the friction in using an external component library is having to learn the patterns. Often API inconsistencies exacerbate the problem. You can reduce that friction by creating a shared API across all your components.
- Use your a11y spec as the roadmap for your integration tests
  Keep it high-level, not framework-specific. You can always be confident that your refractor doesn’t compromise a11y.
