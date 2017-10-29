# sodium-frp-react
> Higher order components to easily use SodiumJS Functional Reactive Programming with Facebook React

## Motivation
React and Redux are a very nice paradigm influenced by ELM. But there are downsides. 

For example, it is adviced to work with normalized data, and that requires the introduction of lookup by identifier. This is error prone, just like imperative pointers are. Furthermore reducers are nothing more than state monads, so the order in which reducers are executed determines the final output. From the point of view of reasoning about code, not much is gained here IMO.

Furthermore presentational components must bubble up events to container components, resulting in a lot of boilerplate code. 

And last but not least, one has to be really careful to get good performance, using reselect as much as possible, resulting in more boilerplate. And although React updates with immutable data are fast, they will never be as fast as in object-oriented two-way binding systems.

Wouldn't it be great if we could get the benefits of React, functional referential transparancy, easy two-way binding and performance, and local reasoning of state?

This tiny package aims to provide just that, thanks to SodiumJS. Sodium performs updates in a deterministic way, without glitches, unlike libraries like RxJS. It is a true functional reactive programming (FRP) library, in the spirit of its original inventors, Conal Elliott and Paul Hudak.


## Install

```bash
npm i sodium-frp-react
```


## Usage
[Checkout the demo](https://github.com/Ziriax/sodium-frp-react-demo)

*TODO: Provide a tutorial*


## See also
* [Stephen Blackheath's book](https://www.manning.com/books/functional-reactive-programming)
* [The Sodium FRP family](https://github.com/SodiumFRP)


## License
[MIT](http://vjpr.mit-license.org)
