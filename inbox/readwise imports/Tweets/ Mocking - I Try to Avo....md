# 🥷 Mocking - I Try to Avo...

- Author: @jangiacomelli on Twitter
- Full Title: 🥷 Mocking - I Try to Avo...
- Category: #tweets
- URL: https://twitter.com/jangiacomelli/status/1329329439554101249
- Cover: ![](https://pbs.twimg.com/profile_images/1226553723603890176/9545lhor.jpg)

### Highlights first exported February 9, 2021 at 7:45 AM

- 🥷 Mocking - I try to avoid it
  I use mocks only when:
  * speed of test suite is a problem
  * using external 3rd party services (e.g. 3rd party HTTP APIs)
  🧵👇 Short thread about my guidelines for mocking
  #Python #pytest #SoftwareTesting
- 🥷Speed is a problem:
  I want my test suite to be fast. I want to run it frequently.
  For example, I had test suite using a real DynamoDB table. It took around 1.5min to run.
  Mock DynamoDB with moto -> 5s to run.
  Now I can run it all the time.
- 🥷 External HTTP API:
  I have integration with the ERP system via the REST API. On every test run, a new product is added to ERP.
  I don't want to actually add a product to ERP - I'll need to delete it somehow.
  I mock API - no need to handle anything in ERP inside my test suite.
- 🥷 By all means, I avoid mocking inside a single package
  For example, I have a blog package.
  I don't mock methods/classes implemented inside the blog package when testing any behavior inside the blog package.
- 🥷 I wrote even more in this post:
  https://t.co/2bKr57lgj0
