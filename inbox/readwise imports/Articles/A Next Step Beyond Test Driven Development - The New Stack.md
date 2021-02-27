# A Next Step Beyond Test Driven Development - The New Stack

- Author: thenewstack.io
- Full Title: A Next Step Beyond Test Driven Development - The New Stack
- Category: #articles #readwiseimport
- URL: https://thenewstack.io/a-next-step-beyond-test-driven-development/
- Cover: ![](https://readwise-assets.s3.amazonaws.com/static/images/article0.00998d930354.png)

### Highlights first exported February 26, 2021 at 9:21 PM

- The most successful software development movement of my lifetime is probably test-driven development or TDD. With TDD, requirements are turned into very specific test cases, then the code is improved so the tests pass. You know it, you probably use it; and this practice has helped our entire industry level up at code quality.
  But it’s time to take a step beyond TDD in order to write better software that actually runs well in production. That step is observability driven development.
- Using TDD to Drive Better Code
- DD has some powerful things going for it. It’s a very pure way of thinking about your software and the problems it’s trying to solve. TDD abstracts away the grimy circus of production and leaves you with deterministic, repeatable bits of code that you can run hundreds of times a day, giving you the warm, fuzzy assurance that your software would continue to work today the same as it worked yesterday and the day before that. But that assurance quickly fades when you start considering whether having passing tests means that your users are actually having a good product experience. Do those passing tests mean that any errors and regressions can be crispily isolated and fixed before your code is released back into the wild?
- TDD helps produce better code, but a fundamental limitation of TDD is exactly the thing that makes it most appealing.
- But just because something about the environment doesn’t go according to plan and gets excluded from TDD, that doesn’t mean it isn’t valuable.
- Using Production to Drive Better Code
- “But that’s not how it’s done! We have confidence in our tests!!!”
  The tests in your code are still valuable. But there’s an additional step we need to take in order to extend our validation to encompass the reality of production. It requires shifting your mindset, developing a practice, and forming a habit.
- Embrace failures.  Instead of being afraid of failure and trying desperately to avoid it, try adopting a mindset of cheery fatalism. Everything will fail eventually, usually at the worst possible time, and in a way you failed to predict.
- Instrument as you go.  Given that we can’t predict the future, the next step is to develop a practice that helps us better see that future as it starts to unfold. This is the practice of developing instrumentation as you go.
- Close the loop.  The habit you then form is one of relentlessly circling back to check on your code once it has been released into the wild. It’s a habit of checking up on any code that has just been deployed through the lens of the instrumentation you just wrote. Is it working as intended? Are you sure? Does anything else look… weird?
- TDD + Prod = ODD
