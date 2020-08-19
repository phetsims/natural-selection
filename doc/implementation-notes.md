# Natural Selection - implementation notes

This document contains notes related to the implementation of Natural Selection. 
This is not an exhaustive description of the implementation.  The intention is 
to provide a high-level overview, and to supplement the internal documentation 
(source code comments) and external documentation (design documents).  

Before reading this document, please read:
* [model.md](https://github.com/phetsims/natural-selection/blob/master/doc/model.md), a high-level description of the simulation model

In addition to this document, you are encouraged to read: 
* [PhET Development Overview](https://github.com/phetsims/phet-info/blob/master/doc/phet-development-overview.md)  
* [PhET Software Design Patterns](https://github.com/phetsims/phet-info/blob/master/doc/phet-software-design-patterns.md)
* [Natural Selection HTML5](https://docs.google.com/document/d/16C5TPL9LfK7JgYbo_NOP80FM5kOvCx2tMkvsZH4leQU/edit#), the design document

## Terminology

Most of terminology that you'll need to navigate the implementation is found throughout [model.md](https://github.com/phetsims/natural-selection/blob/master/doc/model.md). These addition terms are specific to the implementation: 

## Common Patterns

**Model-View Transform**:

**Query Parameters**: Query parameters are used to enable sim-specific features, mainly for debugging and
testing. Sim-specific query parameters are documented in
[NaturalSelectionQueryParameters](https://github.com/phetsims/natural-selection/blob/master/js/common/NaturalSelectionQueryParameters.js).

**Assertions**: The implementation makes heavy use of `assert` to verify pre/post assumptions and perform type checking. This sim performs type-checking for almost all function arguments via `assert`. While this may look like overkill, it did catch quite a few problems during refactoring, and was a net gain. If you are making modifications to this sim, do so with assertions enabled via the `ea` query parameter.

**Memory Management**: All uses of `link`, `addListener`, etc. are documented as to whether they need a corresponding `unlink`, `removeListener`, etc.

All classes have a `dispose` method. Classes whose instances exist for the lifetime of the sim are not intended to 
be disposed, and their `dispose` implementation looks like this:

```js
  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
```

## Model

## View

## PhET-iO

PhET-iO is a PhET product that is described at https://phet-io.colorado.edu. If you're not familiar with PhET-iO, you can skip this section, which describes patterns used in the PhET-iO instrumentation of this sim. 

**PhetioGroup is encapsulated**: `PhetioGroup` is the mechanism for managing dynamic elements. The dynamic elements in this sim are of instances of `Bunny` and `Wolf`. Instances of `Bunny` are created by `BunnyGroup`, which is private to `BunnyCollection`.  Instances of `Wolf` are created by `WolfGroup`, which is private to `WolfCollection`.  This pattern of using a "Collection" wrapper hides the details of PhetioGroup from all other parts of the simulation.

***IO Types delegate to Core Types**: IO Types are PhET-iO mechanism for handling serialization of elements that are instances of Core Types. For example, `BunnyIO` is the IO Type that serializes the `Bunny` Core Type.  Throughout this simulation, IO Type delegate serialization to their associated Core Types.  This ensures that the API of the Core Type is not violated by acccessing private members.

  
