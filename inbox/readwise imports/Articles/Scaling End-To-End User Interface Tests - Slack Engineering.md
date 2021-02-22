# Scaling End-To-End User Interface Tests - Slack Engineering

- Author: slack.engineering
- Full Title: Scaling End-To-End User Interface Tests - Slack Engineering
- Category: #articles
- URL: https://slack.engineering/scaling-end-to-end-user-interface-tests/
- Cover: ![](https://readwise-assets.s3.amazonaws.com/static/images/article2.74d541386bbf.png)
- Citation: [[@chodavarapuScalingEndtoEndUser2020]]
### Highlights first exported February 19, 2021 at 9:33 AM

- Finding a framework for end-to-end tests
- Since there were no guardrails on how to add these tests, the framework ended up with a lot of duplicate code and flaky tests. This led to random test failures and longer triage shifts.
    - **Note:** test suites can accumulate technical debt also, as they start to become flakey - confidence in the test suite drops, and can start to become a pain point and something that people think is slowing them down, instead of enabling faster and more reliable delivery.
- But where there is a problem, there is always an opportunity! The QE team decided to look for a better way to solve some of the pain points we were having within cypress. Our solution is a variation of the Page Object Model: We created a layer of abstraction between user interface and the actual test. We time-boxed the effort to one month and worked on using the proof of concept on a set of tests.
    - **Note:** the pain point needs to be felt at times to better understand what the correct abstraction is.
      Too often people try and abstract too much too soon in the name of staying DRY - and end up fighting their own abstractions.
- Abstract it all away
- To make it easier to read, write, and maintain our end-to-end tests, we created a number of Slack-specific methods and bundled them up in a library.
    - **Note:** start building a common language, a domain specific language for your tests that makes sense to you and others, and be able to communicate that.
- For the UI Abstraction/Page Object Model approach, we broke things out in the components.
- We came up with a few best practices to guide our work:
  Selecting Elements: Instead of relying on product-driven class names or element ids, we add a custom “data-qa” attribute to elements that we need to select for testing purposes. This allows us to provide context for our selectors so they aren’t impacted by JS/CSS changes.
  Only create new components when needed. We shouldn’t try to define every UI Action possible, but define those that are being used by our test.
  Methods within a component should only modify the piece of UI that they’re written for. The component for the channel sidebar shouldn’t interact with the message input, for instance.
  Try to only break items into components where it makes sense rather than creating a lot of smaller components.
  The UI Abstraction is stateless. The test should maintain the state and validate against it.
- This allows us to provide context for our selectors so they aren’t impacted by JS/CSS changes ^e1d6f9
    - **Note:** when tests fail for reasons that have nothing to do with the thing you are testing, confidence drops - tests should pass, or fail for expected and related reasons.
- Try to only break items into components where it makes sense rather than creating a lot of smaller components.
    - **Note:** I've noticed a trend with components, depending on the team where they can fall onto two extremes
      - page-like thinking, and everything is a page
      - trying to break things down too small 
      there isn't a fast set rule on when to break things up, but can consider - is this component doing too much? what are the logical boundaries? etc
- The above diagram represents a simplified version of our page object model (POM):
  Web Element Representation of a piece of UI. For example a button or a text box would be a WebItem. Here is where we define all the actions you can take on a element.
  BaseComponent Represents a component. Any component should extend this class. A component consists of Web Elements and other components.
  BaseModal Represents a modal. Any modal should extend this class.
- Takeaways
  When we compare the test results from before versus the tests that have been migrated to use UI Abstraction framework, we’re able to see a 60% reduction in flakiness. Both automation engineers and front end engineers found it easier to add and maintain more tests.
  Our team is currently working on migrating all the E2E tests to use UI Abstraction. There are several efforts underway to reduce test flakiness further.
