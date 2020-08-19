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
* [Natural Selection HTML5](https://docs.google.com/document/d/16C5TPL9LfK7JgYbo_NOP80FM5kOvCx2tMkvsZH4leQU/edit#), the design document (which may be out of date)

## Terminology

Most of terminology that you'll need to navigate the implementation is found in [model.md](https://github.com/phetsims/natural-selection/blob/master/doc/model.md). 

Terms that are specific to the implementation:

* An _organism_ is a living thing. It includes bunnies, wolves, and shrubs.
* The _environment_ is the part of the UI where bunnies hop around, and it can be switched between "equator" and "arctic".
* The _simulation mode_ determines what UI components are available. See `SimulationMode`.
* A _sprite_ is a high-performance way of drawing an organism, using the scenery `Sprites` API.
* A _plot_ is a set of points connected by line segments, used in the Population graph.

## Common Patterns

**Model-View Transform**: There are 3 different model-view transforms in this sim.

_Environment_: The model uses a unitless 3D coordinate frame, where +x is to the left, +y is up, and +z is into the screen. The view uses scenery's standard coordinate frame, where +x is to the left, and +y is down. `EnvironmentModelViewTransform` handles the transforms, and has very detailed documentation in the source code header. 

_Population graph_: The model uses a 2D coordinate frame, where +generation is to the right, and +population is up. The view uses scenery's standard coordinate frame, where +x is to the left, and +y is down. Because drawing plots needs to be lightweight and high-performance, `ModelViewTransform` is not used here. Model-to-view transform is handled by `PopulationPlotNode` (see `modelToViewX` and `modelToViewY`). View-to-model transform is unnecessary.

_Data Probe_: The model uses a 2D coordinate frame, where +generation is to the right, and +population is up. The view uses scenery's standard coordinate frame, where +x is to the left, and +y is down. The data probe can only move horizontally, so the y-axis is irrelevant. But positon is a `Vector2` because it's required by DragListener. `ModelViewTransform` handles the transforms.

**Query Parameters**: Query parameters are used to enable sim-specific features. Some of these query parameters are public, but most are for debugging and
tuning model behavior. Sim-specific query parameters are documented in
[NaturalSelectionQueryParameters](https://github.com/phetsims/natural-selection/blob/master/js/common/NaturalSelectionQueryParameters.js).

**Assertions**: The sim makes heavy use of `assert` to verify pre/post assumptions and perform type checking. This sim performs type-checking for almost all function arguments via `assert`. If you are making modifications to this sim, do so with assertions enabled via the `ea` query parameter.

**Logging**: The sim makes heavy use of logging via `phet.log`, enabled using the `log` query parameter. If you are making modifications to this sim, or trying to understand its behavior, do so with logging enabled.

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

This section provides a quick overview of the model.

The main model class is `NaturalSelectionModel`. It manages how the sim is playing (play, pause, speed) and what mode the sim is in (see `SimulationMode`). Everything else is delegated to other model elements. `NaturalSelectionModel` is used by both screens, with no differences. Genes and environmental factors that are not relevant in the _Intro_ screen are hidden by the view.

There are a few top-level model elements:

* `GenerationClock` is responsible for the elapsed time in generations
* `GenePool` is the collection of genes that are present in the bunny population 
* There is one instance of `Gene` for fur, teeth, and ears.  They live in the `GenePool` and they globally determine dominance relationship, and whether a mutation is going to occur. 

Living things are instances of `Organism`. There are 3 subclasses of Organism:

* `Bunny` - created dynamically, moves around, has reference to parents, has a `Genotype` and a `Phenotype`
* `Wolf` - created dynamically, moves around
* `Shrub` - created statically at startup, remains stationary

Organisms are organized into collections:

* `BunnyCollection` - `Bunny` instances, responsible for reproduction and death due to old age
* `WolfCollection` - `Wolf` instances, responsible for eating bunnies
* `Food` - `Shrub` instances, responsible for starving bunnies

There is a sub-model for each graph:

* `PopulationGraph`
* `ProportionsGraph`
* `PedigreeGraph`

Here are the entry points to some of the major features of the model:

* Main animation loop: `NaturalSelectionModel.step`
* Bunny motion: `Bunny.move`
* Bunny appearance: `Phenotype`, `GenePair.getVisibleAllele`
* Wolf motion: `Wolf.move`
* Stuff that happens at 12:00: see `clockGenerationProperty` listener in `NaturalSelectionModel`
* Death due to old age: `BunnyCollection.ageBunnies`
* Reproduction: `BunnyCollection.mateBunnies` and `PunnettSquare`
* Wolves: `WolfCollection.eatBunnies`
* Tough Food: `Food.applyToughFood`
* Limited Food: `Food.applyLimitedFood`
* Bunnies have taken over the world: `BunnyCollection.bunniesHaveTakenOverTheWorldEmitter`
* All of the bunnies have died: `BunnyCollection.allBunniesHaveDiedEmitter`
* Memory management of dead bunnies: `BunnyCollection.pruneBunnies`
* Population graph data points: `see ObservableArray instances in PopulationModel`
* Proportions graph start/end counts: `ProportionsCounts`
* Pedigree graph: shows a tree for `BunnyCollection.selectedBunnyProperty`
* Genotype abbreviation: `Genotype.abbreviationProperty`, `GenePair.getGenotypeAbbreviation`
* Initializing the bunny population via query parameters: `parseInitialPopulation.js`, `NaturalSelectionQueryParameters`, 

## View

This section provides a quick overview of the view.

The main view class is `NaturalSelectionScreenView`. It is used by both screens, and simply hides genes and environmental factors that are not relevant for the _Intro_ (see options in `IntroScreenView`).

`GenerationClock` displays the generation clock. It appears at the top-center of the UI. When environmental factors are enabled, the clock reveals color-coded "slices" that show when those environmental factors will be applied.

`natural-selection/js/common/view/` organizes independent parts of the view into 4 subdirectories:

* `environment/` - specific to the part of the screen where the bunnies hop around, main class `EnvironmentNode`
* `population/` - specific to the Population graph, main class `PopulatioNode`
* `proportions/` - specific to the Proportions graph, main class `ProportionsNode`
* `pedigree/` - specific to the Pedigree graph, main class `PedigreeNode`

Here are the entry points to some of the major features of the view:

* Draw the bunnies, wolves, and shrubs: `OrganismSprites`
* Add a bunny to the view: `OrganismSprites.createBunnySpriteInstance`
* Add a wolf to the view: `OrganismSprites.createWolfSpriteInstance`
* Map a bunny to an image: `BunnyImageMap`
* Plot data on the Population graph: `PopulationPlotNode`
* Draw bars in the Proportions graph: `ProportionsBarNode`
* Pedigree tree structure: `PedigreeBranchNode`
* Manage the "Mutation Coming" popups: `MutationAlertsNode`
* Sim reaches its memory limit: see `new MemoryLimitDialog` in `NaturalSelectionScreenView`

## PhET-iO

PhET-iO is a PhET product that is described at https://phet-io.colorado.edu. If you're not familiar with PhET-iO, you can skip this section, which describes patterns used in the PhET-iO instrumentation of this sim. 

**PhetioGroup is encapsulated**: `PhetioGroup` manages dynamic elements. The dynamic elements in this sim are instances of `Bunny` and `Wolf`. Instances of `Bunny` are created by `BunnyGroup`, which is private to `BunnyCollection`.  Instances of `Wolf` are created by `WolfGroup`, which is private to `WolfCollection`.  This pattern of using a "Collection" wrapper hides the details of PhetioGroup from all other parts of the simulation.

**IO Types delegate to Core Types**: IO Types handle serialization of elements that are instances of Core Types. For example, `BunnyIO` is the IO Type that serializes the `Bunny` Core Type.  Throughout this simulation, each IO Type delegates serialization to its associated Core Type.  This ensures that the API of the Core Type is not violated by acccessing private members.

**Configure the Genes for a screen**: `GeneVisibilityManager` contains a `{{gene}}VisibleProperty` for each Gene, which controls the visiblity of all UI components for that gene. Use these Properties via Studio to quickly configure which genes appear in the UI. Search for "view.genes" in Studio.

**Configure the Environmental Factors for a screen**: Configuring which environmental factors are available for a screen is as easy as deciding which checkboxes to make visible.  Search for `wolvesCheckbox`, `toughFoodCheckbox`, and `limitedFoodCheckbox` in Studio, and set their visibleProperty as desired.

  
