# Singular Update Queue

- Author: martinfowler.com
- Full Title: Singular Update Queue
- Category: #articles #readwiseimport
- URL: https://martinfowler.com/articles/patterns-of-distributed-systems/singular-update-queue.html
- Cover: ![](https://readwise-assets.s3.amazonaws.com/static/images/article1.be68295a7e40.png)

### Highlights first exported February 26, 2021 at 9:21 PM

- Consider the example of the Write-Ahead Log pattern. We need entries to be processed one at a time, even if several concurrent clients are trying to write. Generally locks are used to protect against concurrent modifications. But if the tasks being performed are time consuming, like writing to a file, blocking all the other calling threads until the task is completed can have severe impact on overall system throughput and latency ([View Highlight](https://instapaper.com/read/1354883734/15540971))
- Solution
  Implement a workqueue and a single thread working off the queue. Multiple concurrent clients can submit state changes to the queue. But a single thread works on state changes. This can be naturally implemented with goroutines and channels in languages like golang. ([View Highlight](https://instapaper.com/read/1354883734/15540976))
    - **Note:** This reminds me about of redux - actions could be async, but calling updates on the reducers was synchronous
- Figure 1: Single Thread Backed By A Work Queue ([View Highlight](https://instapaper.com/read/1354883734/15540977))
- Backpressure ([View Highlight](https://instapaper.com/read/1354883734/15540983))
- Backpressure can be an important concern when a work queue is used to communicate between threads. In case the consumer is slow and the producer is fast, the queue might fill up fast ([View Highlight](https://instapaper.com/read/1354883734/15540997))
    - **Note:** If the consumer is too slow, and producer is too fast - need to consider how to manage the extra requests
- Other Considerations ([View Highlight](https://instapaper.com/read/1354883734/15541009))
- Task Chaining. ([View Highlight](https://instapaper.com/read/1354883734/15541011))
- Making External Service Calls. ([View Highlight](https://instapaper.com/read/1354883734/15541016))
    - **Note:** Where do side effects happen?
- Examples ([View Highlight](https://instapaper.com/read/1354883734/15541020))
- The Zookeeper implementation of request processing pipeline is done with single threaded request processors ([View Highlight](https://instapaper.com/read/1354883734/15541022))
- Controller in Apache Kafka, which needs to update state based on to multiple concurrent events from zookeeper, handles them in a single thread with all the event handlers submitting the events in a queue ([View Highlight](https://instapaper.com/read/1354883734/15541023))
- Cassandra, which uses SEDA architecture, uses single threaded stages to update its Gossip state ([View Highlight](https://instapaper.com/read/1354883734/15541024))
- Etcd and other go-lang based implementation have a single goroutine working off a request channel to update its state ([View Highlight](https://instapaper.com/read/1354883734/15541025))
- LMAX-Diruptor architecture follows Single Writer Principle to avoid mutual exclusion while updating local state. ([View Highlight](https://instapaper.com/read/1354883734/15541027))
