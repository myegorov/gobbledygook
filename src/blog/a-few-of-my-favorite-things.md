---
title: These are a few of my favorite things...
date: 2017-09-21
keywords: collaborative editor, JSON, projects
draft: false
highlighting: true
---

Some brief notes on a couple of projects
I've been involved with this year for my edification and for
profit ;)

## [edit-along](https://github.com/myegorov/edit-along)

### Collaborative in-browser text editor

  + permit multiple clients to edit a file simultaneously
  + optimize for low latency
  + ensure consistency
  + bonus: suitable for any format for which _diff_ and _patch_
      algorithms exist

### Challenges

  + onboard new member (snapshot) and offboard clients
  + consensus to restore consistency (dead proc revived & syncing up)
  + synchronization strategies
    1. pessimistic concurrency
    2. optimistic concurrency

### Pessimistic concurrency control

Methods to achieve consistency

  + mutual exclusion (locking)
  + total order of delivering updates to clients
  + consensus to restore consistency in the event of network failure
  + clients block each other's progress

### Can this approach scale?

Consider the time complexity of mutual exclution:

- typing @ 50 wpm -> assuming edit proportional to characters typed, this amounts to 300ms per edit
- O(log n) messages exchanged to enter the critical section, 
    e.g. O(3) requests for 5 clients using the service
- approx. 50ms per request suggests 150ms to enter the critical section
- __approx. 2 processes switching back and forth and editing without a lag__

### Any alternatives?

Enters optimistic concurrency control:

+ reduce latency at the cost of some loss of fidelity
+ guarantee eventual consistency
+ [Differential Synchronization](https://neil.fraser.name/writing/sync/) algorithm developed by Neil 
    Fraser @ Google (mid '00s)
- used by Eclipse & Gedit plugins
- more robust algorithms (e.g. [Operational Transformation](https://en.wikipedia.org/wiki/Operational_transformation)) exist, but
    their implementation is considerably more involved

### The algorithm

<figure>
  <img src="https://neil.fraser.name/writing/sync/diff2.gif" alt="differential synchronization (source: )" class="opening-cover-image"/>
  <figcaption>Differential synchronization algorithm (source: https://neil.fraser.name/writing/sync/ ) </figcaption>
</figure>

### Normal operations

+ works symmetrically on the client & server
+ continuous cycling of _diff_ and _patch_ operations
+ use vector clocks to infer causal ordering
+ relies on the fact that edits will likely share _recognizable context_
+ patches applied on the best-effort basis: if not enough recognizable 
    context, patches may fail; they will then show up negatively in the 
    following half-cycle

### Error scenarios

The algorithm is forgiving of unreliable networks:

- duplicate packet
- lost return packet
- lost outbound packet
- out-of-order packet
- other memory/network corruption scenarios:
    worst come to worst, the server will re-initialize the client

## [json-distill](https://github.com/meetearnest/json-distill)

This past summer I had the good fortune to work in the company of some
very capable developers and all around wonderful people at [Earnest](https://www.earnest.com/).
One of the two projects I completed while there turned out to be particularly
rewarding and involved designing a tiny domain specific language and implementing an
interpreter to go with it for querying JSON. In the process, I discovered
the joy of logic programming and conceived of a pet project to work on in
the coming months. The GitHub link is off limits at present, but I'm
hoping that the project will be released under an open source license.


### Problem statement:

  - under the ideal circumstances, the service endpoint exactly matches the client's data requirements
  - downsides: impractical for the current division of labor between the back-
      and front-end teams, multiplies one-off API endpoints, services coupled to UI

### What if...

- the back-end could be merely a gateway wrapping and abstracting the access to
    private data
- a service exposes _a scope_ to the client
- the client can fetch more or less on demand
- reduces the number of requests, data transfer and one-off endpoints
- redefines the client-server relationship in terms of 
    pure information asymmetry:
    1. the server knows private data models,
        is ignorant of client's needs,
        can distinguish among clients with different access privileges
    2. the client has a contract with the server to
        expose some data scope and some computation capacity

### Industrial strength solution

- `GraphQL`, `Falcor` etc.
- require significant re-tooling, which limits the rate of adoption

### What I set out to do

- an MVP implementing a fraction of the bells and whistles that
    `GraphQL` provides
- focus on what matters, solve the majority of use cases without the complexity
- upside: no retooling for an existing API
- end result: a JS library shared between the client and server:
    https://github.com/meetearnest/json-distill

### How do we typically deal with big JSON?

- select data following specific paths, or
- pass response through `filter_1 | ... | filter_n`
- downsides: brittle, cognitive overhead from keeping track of
    extraneous details

### Is there a query language for JSON?

  >asked: 8 years, 3 months ago

  >viewed: 87,895 times

  >active: 1 month ago

[https://stackoverflow.com/questions/777455/is-there-a-query-language-for-json](https://stackoverflow.com/questions/777455/is-there-a-query-language-for-json)

### Can we do it in a simpler way?

Sample JSON:

```javascript
1     {
2       ...
3         "ancestor": ...
            ...
              "parent": {
                "child": ...,
                "sibling": ...,
                ...
              },
            ...
          ...
        ...
13852 }
```

Query to match:

```javascript
const query = `
{
  ancestor {
    parent {@parent
        child
        sibling
    }
  }
}
`;
```

A few additional features:

```javascript
const query = `
{
  ancestor {
    parent (${aFilter}) {@parent @container
        child
        sibling
    }
  }
}
`;
```

Can in principle serialize and pass with the query a callback to
filter results in the context made available by the service:

```javascript
const { match } = require('json-distill');

const aFilter = (results, context) => {
    // ...filter 'results' with access to 'context'
};

const query = `
{
  ancestor {
    parent (${aFilter}) {@parent @container
        child
        sibling
    }
  }
}
`;
```

### Main use case: match on the server

- a client sends its data requirements to the service as a query template
- the service fulfills the custom query
- execute custom JS within a virtual environment on the server
    (`vm2` sandbox built into the library)
- demo:
    [https://github.com/meetearnest/json-distill/tree/master/test/sample-service](https://github.com/meetearnest/json-distill/tree/master/test/sample-service)


However, we're not limited to server-side processing.  Can pattern
match JSON from within any module:

```javascript
const results = fetch(
    'https://www.googleapis.com/...')
  .then(res => res.json())
  .then(json => match(query, json));
```

### NP-hard crux

Reasons for optimism: typical JSON object to be pattern matched is not significantly larger
than the DOM tree that the language of CSS selectors or jQuery target.

- query can be interpreted as a set of constraints
- constraint programming is an interesting area of AI in itself
- lack of quality JS libraries for constraint programming
- currently using a proof-of-concept level [project](https://github.com/shd101wyy/logic.js)
    that implements a tiny subset of `Prolog`
    functionality for defining and solving constraints: inefficient search, no inference of constraints, no pruning
- future plan: port [`clojure/core.logic`](https://github.com/clojure/core.logic) to JS, rather than implement
    ad hoc search logic
