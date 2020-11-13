# Natural Selection - implementation notes

@author Chris Malley (PixelZoom, Inc.)

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

The domain terminology that you'll need to navigate the implementation is found in [model.md](https://github.com/phetsims/natural-selection/blob/master/doc/model.md). 

Additional terms used in the implementation:

* A _**clock slice**_ is an interval of the generation clock.
* The _**environment**_ is the part of the UI where bunnies hop around. It can be switched between "equator" and "arctic", see [Environment](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Environment.js).
* An _**original mutant**_ is a bunny in which a mutation first occurred.
* An _**organism**_ is a living thing. It includes bunnies, wolves, and shrubs.
* A _**plot**_ is a set of points connected by line segments, used in the Population graph.
* The _**simulation mode**_ determines what UI components are available. See [SimulationMode](https://github.com/phetsims/natural-selection/blob/master/js/common/model/SimulationMode.js).
* A _**sprite**_ is a high-performance way of drawing an organism, using the scenery [Sprites](https://github.com/phetsims/scenery/blob/master/js/nodes/Sprites.js) API.

## General Consideration

This section describes how this sim addresses implementation considerations that are typically encountered in PhET sims.

**Model-View Transform**

There are 3 different model-view transforms in this sim.

* _Environment_: The model uses a unitless 3D coordinate frame, where +x is to the left, +y is up, and +z is into the screen. The view uses scenery's standard coordinate frame, where +x is to the left, and +y is down. [EnvironmentModelViewTransform](https://github.com/phetsims/natural-selection/blob/master/js/common/model/EnvironmentModelViewTransform.js) handles the transforms, and has very detailed documentation in the source code header. 

* _Population graph_: The model uses a 2D coordinate frame, where +generation is to the right, and +population is up. The view uses scenery's standard coordinate frame, where +x is to the left, and +y is down. Because drawing plots needs to be lightweight and high-performance, `MoelViewTransform` is not used here. Model-to-view transform is handled by [PopulationPlotNode](https://github.com/phetsims/natural-selection/blob/master/js/common/view/population/PopulationPlotNode.js) (see `modelToViewX` and `modelToViewY`). View-to-model transform is unnecessary.

* _Data Probe_: The model uses a 2D coordinate frame, where +generation is to the right, and +population is up. The view uses scenery's standard coordinate frame, where +x is to the left, and +y is down. The data probe can only move horizontally, so the y-axis is irrelevant, but position is (for convenience) a `Vector2` because it's required by `DragListener`. `ModelViewTransform` handles the transforms.

**Query Parameters**

Query parameters are used to enable sim-specific features. Sim-specific query parameters are documented in
[NaturalSelectionQueryParameters](https://github.com/phetsims/natural-selection/blob/master/js/common/NaturalSelectionQueryParameters.js). Some of these query parameters are public, but most are for debugging and tuning model behavior. There are features that can only be accessed via query parameters, so be sure to have a look. The query parameters for initializing the population are particularly important (and complicated!)

**Assertions**

The sim makes heavy use of `assert` and [AssertUtils](https://github.com/phetsims/phetcommon/blob/master/js/AssertUtils.js) to verify pre/post assumptions and perform type checking. This sim performs type-checking for almost all function arguments via `assert` (but it's not a requirement that type-checking is done everywhere). If you are making modifications to this sim, do so with assertions enabled via the `ea` query parameter.

**Logging**

The sim makes heavy use of logging via `phet.log`. If you are making modifications to this sim, or trying to understand its behavior, do so with logging enabled via the `log` query parameter.

**Memory Management** 

* **Listeners**: All uses of `link`, `addListener`, etc. are documented as to whether they need a corresponding `unlink`, `removeListener`, etc. For example:

```js
    // Scrolls the x-axis so that 'now' is always the max x value. unlink is not necessary.
    timeInGenerationsProperty.link( timeInGeneration => {
      ...
```

* **dispose:** All classes have a `dispose` method. Sim-specific classes whose instances exist for the lifetime of the sim are not intended to 
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

* **Dead bunnies**: When bunnies die, they cannot be immediately disposed. Their information is needed by the Pedigree graph. If we kept them forever, we'd run out of memory. [BunnyCollection](https://github.com/phetsims/natural-selection/blob/master/js/common/model/BunnyCollection.js)`.pruneDeadBunnies` handles pruning dead bunnies, disposing of them when they are no longer needed by the Pedigree graph.

* **Generation limit:** It's possible to put this sim in a state where the population stabilizes, and the sim will run forever. The sim would continue to create data points for the Population graph, and would eventually crash the browser.  So the sim has a limit on the number of generations, see `maxGenerations` in [NaturalSelectionQueryParameters](https://github.com/phetsims/natural-selection/blob/master/js/common/NaturalSelectionQueryParameters.js). When this limit is reached, the sim stops, [MemoryLimitDialog](https://github.com/phetsims/natural-selection/blob/master/js/common/view/MemoryLimitDialog.js) is displayed, and the student can review the final state of the sim. 

## Screens

The sim has two screens, named _Intro_ and _Lab_.  The implementation of the model and view for these screens is identical. The view simply hides the genes and environmental factors that are not desired for a screen.  The _Intro_ screen includes the fur gene, wolves, and limited food.  The _Lab_ screen includes the full set of genes and environmental factors.

## Model

This section provides a quick overview of the model.

The main model class is [NaturalSelectionModel](https://github.com/phetsims/natural-selection/blob/master/js/common/model/NaturalSelectionModel.js). It manages how the sim is playing (play, pause, fast-forward) and what mode the sim is in (see [SimulationMode](https://github.com/phetsims/natural-selection/blob/master/js/common/model/SimulationMode.js)). Other responsibilities are delegated to other model elements.

There are a few top-level model elements:

* [GenerationClock](https://github.com/phetsims/natural-selection/blob/master/js/common/model/GenerationClock.js) is responsible for the elapsed time in generations.
* [GenePool](https://github.com/phetsims/natural-selection/blob/master/js/common/model/GenePool.js) is the collection of genes that are present in the bunny population.
* There is one instance of [Gene](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Gene.js) for each gene: fur, teeth, ears.  They live in the [GenePool](https://github.com/phetsims/natural-selection/blob/master/js/common/model/GenePool.js) and they determine mutations and dominance relationships.
* There is one instance of [Allele](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Allele.js) for each gene variant: white fur, brown fur, straight ears, floppy ears, short teeth, long teeth. These instances are global to the sim.

Living things are instances of [Organism](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Organism.js). There are 3 subclasses of Organism:

* [Bunny](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Bunny.js) - created dynamically, moves around, has reference to parents, has a [Genotype](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Genotype.js) and a [Phenotype](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Phenotype.js)
* [Wolf](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Wolf.js) - created dynamically, moves around
* [Shrub](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Shrub.js) - created statically at startup, remains stationary

Organisms are organized into collections:

* [BunnyCollection](https://github.com/phetsims/natural-selection/blob/master/js/common/model/BunnyCollection.js) - [Bunny](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Bunny.js) instances, responsible for reproduction and death due to old age
* [WolfCollection](https://github.com/phetsims/natural-selection/blob/master/js/common/model/WolfCollection.js) - [Wolf](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Wolf.js) instances, responsible for eating bunnies
* [Food](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Food.js) - [Shrub](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Shrub.js) instances, responsible for starving bunnies

There is a sub-model for each graph:

* [PopulationModel](https://github.com/phetsims/natural-selection/blob/master/js/common/model/PopulationModel.js)
* [ProportionsModel](https://github.com/phetsims/natural-selection/blob/master/js/common/model/ProportionsModel.js)
* [PedigreeModel](https://github.com/phetsims/natural-selection/blob/master/js/common/model/PedigreeModel.js)

Here are pointers to some of the major features of the model:

* Main animation loop: [NaturalSelectionModel](https://github.com/phetsims/natural-selection/blob/master/js/common/model/NaturalSelectionModel.js)`.step`
* Bunny motion: [Bunny](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Bunny.js)`.move`
* Bunny appearance: [Phenotype](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Phenotype.js), [GenePair](https://github.com/phetsims/natural-selection/blob/master/js/common/model/GenePair.js)`.getVisibleAllele`
* Wolf motion: [Wolf](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Wolf.js)`.move`
* Stuff that happens at 12:00: see `clockGenerationProperty` listener in [NaturalSelectionModel](https://github.com/phetsims/natural-selection/blob/master/js/common/model/NaturalSelectionModel.js)
* Death due to old age: [BunnyCollection](https://github.com/phetsims/natural-selection/blob/master/js/common/model/BunnyCollection.js)`.ageBunnies`
* Reproduction: [BunnyCollection](https://github.com/phetsims/natural-selection/blob/master/js/common/model/BunnyCollection.js)`.mateBunnies` and [PunnettSquare](https://github.com/phetsims/natural-selection/blob/master/js/common/model/PunnettSquare.js)
* Wolves: [WolfCollection](https://github.com/phetsims/natural-selection/blob/master/js/common/model/WolfCollection.js)`.eatBunnies`
* Tough Food: [Food](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Food.js)`.applyToughFood`
* Limited Food: [Food](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Food.js)`.applyLimitedFood`
* Bunnies have taken over the world: [BunnyCollection](https://github.com/phetsims/natural-selection/blob/master/js/common/model/BunnyCollection.js)`.bunniesHaveTakenOverTheWorldEmitter`
* All of the bunnies have died: [BunnyCollection](https://github.com/phetsims/natural-selection/blob/master/js/common/model/BunnyCollection.js)`.allBunniesHaveDiedEmitter`
* Sim reaches its memory limit: [NaturalSelectionModel](https://github.com/phetsims/natural-selection/blob/master/js/common/model/NaturalSelectionModel.js)`.memoryLimitEmitter`
* Memory management of dead bunnies: [BunnyCollection](https://github.com/phetsims/natural-selection/blob/master/js/common/model/BunnyCollection.js)`.pruneBunnies`
* Population graph data points: see `ObservableArrayDef` instances in [PopulationModel](https://github.com/phetsims/natural-selection/blob/master/js/common/model/PopulationModel.js)
* Proportions graph start/end counts: [ProportionsCounts](https://github.com/phetsims/natural-selection/blob/master/js/common/model/ProportionCounts.js)
* Pedigree graph: shows a tree for [BunnyCollection](https://github.com/phetsims/natural-selection/blob/master/js/common/model/BunnyCollection.js)`.selectedBunnyProperty`
* Genotype abbreviation: [Genotype](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Genotype.js)`.abbreviationProperty`, `GenePair.getGenotypeAbbreviation`
* Initialize the bunny population via query parameters: [parseInitialPopulation.js](https://github.com/phetsims/natural-selection/blob/master/js/common/model/parseInitialPopulation.js), [NaturalSelectionQueryParameters](https://github.com/phetsims/natural-selection/blob/master/js/common/NaturalSelectionQueryParameters.js)

## View

This section provides a quick overview of the view.

The main view class is [NaturalSelectionScreenView](https://github.com/phetsims/natural-selection/blob/master/js/common/view/NaturalSelectionScreenView.js). It is used by both screens, and simply hides genes and environmental factors that are not relevant for the _Intro_ screen (see options in [IntroScreenView](https://github.com/phetsims/natural-selection/blob/master/js/intro/view/IntroScreenView.js)).

[GenerationClockNode](https://github.com/phetsims/natural-selection/blob/master/js/common/view/GenerationClockNode.js) displays the generation clock. It appears at the top-center of the UI. When environmental factors are enabled, the clock reveals color-coded "slices" that show when those environmental factors will be applied.

[natural-selection/js/common/view/](https://github.com/phetsims/natural-selection/tree/master/js/common/view) organizes independent parts of the view into 4 subdirectories:

* [environment/](https://github.com/phetsims/natural-selection/tree/master/js/common/view/environment) - specific to the part of the screen where the bunnies hop around, main class [EnvironmentNode](https://github.com/phetsims/natural-selection/blob/master/js/common/view/environment/EnvironmentNode.js)
* [pedigree/](https://github.com/phetsims/natural-selection/tree/master/js/common/view/pedigree) - specific to the Pedigree graph, main class [PedigreeNode](https://github.com/phetsims/natural-selection/blob/master/js/common/view/pedigree/PedigreeNode.js)
* [population/](https://github.com/phetsims/natural-selection/tree/master/js/common/view/population) - specific to the Population graph, main class [PopulationNode](https://github.com/phetsims/natural-selection/blob/master/js/common/view/population/PopulationNode.js)
* [proportions/](https://github.com/phetsims/natural-selection/tree/master/js/common/view/proportions) - specific to the Proportions graph, main class [ProportionsNode](https://github.com/phetsims/natural-selection/blob/master/js/common/view/proportions/ProportionsNode.js)

Here are pointers to some of the major features of the view:

* Draw the bunnies, wolves, and shrubs: [OrganismSprites](https://github.com/phetsims/natural-selection/blob/master/js/common/view/environment/OrganismSprites.js)
* Add a bunny to the view: [OrganismSprites](https://github.com/phetsims/natural-selection/blob/master/js/common/view/environment/OrganismSprites.js)`.createBunnySpriteInstance`
* Add a wolf to the view: [OrganismSprites](https://github.com/phetsims/natural-selection/blob/master/js/common/view/environment/OrganismSprites.js)`.createWolfSpriteInstance`
* Map a bunny to an image: [BunnyImageMap](https://github.com/phetsims/natural-selection/blob/master/js/common/view/BunnyImageMap.js)
* Plot data on the Population graph: [PopulationPlotNode](https://github.com/phetsims/natural-selection/blob/master/js/common/view/population/PopulationPlotNode.js)
* Draw a bar for the Proportions graph: [ProportionsBarNode](https://github.com/phetsims/natural-selection/blob/master/js/common/view/proportions/ProportionsBarNode.js)
* Pedigree tree structure: [PedigreeBranchNode](https://github.com/phetsims/natural-selection/blob/master/js/common/view/pedigree/PedigreeBranchNode.js)
* Manage the "Mutation Coming" popups: [MutationAlertsNode](https://github.com/phetsims/natural-selection/blob/master/js/common/view/MutationAlertsNode.js)

## PhET-iO

This section describes patterns and features that are specific to PhET-iO instrumentation. PhET-iO is a PhET product that is described at https://phet-io.colorado.edu. If you're not familiar with PhET-iO, you can skip this section.

**PhetioGroup is encapsulated**: [PhetioGroup](https://github.com/phetsims/tandem/blob/master/js/PhetioGroup.js) manages dynamic elements. The dynamic elements in this sim are instances of [Bunny](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Bunny.js) and [Wolf](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Wolf.js). Instances of [Bunny](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Bunny.js) are created by [BunnyGroup](https://github.com/phetsims/natural-selection/blob/master/js/common/model/BunnyGroup.js), which is private to [BunnyCollection](https://github.com/phetsims/natural-selection/blob/master/js/common/model/BunnyCollection.js).  Instances of [Wolf](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Wolf.js) are created by [WolfGroup](https://github.com/phetsims/natural-selection/blob/master/js/common/model/WolfGroup.js), which is private to [WolfCollection](https://github.com/phetsims/natural-selection/blob/master/js/common/model/WolfCollection.js).  This pattern of using a "Collection" wrapper hides the details of PhetioGroup from all other parts of the sim.

**IO Types delegate to Core Types**: IO Types handle serialization of elements that are instances of Core Types. For example, BunnyIO is the IO Type that serializes the [Bunny](https://github.com/phetsims/natural-selection/blob/master/js/common/model/Bunny.js) Core Type.  Throughout this sim, each IO Type delegates serialization to its associated Core Type.  This ensures that serialization does not access private members of the Core Type.

**Generating tandem names**: In some places you'll see tandem names that are created using string concatenation, for example:

```js
tandem: options.tandem.createTandem( `${gene.tandemPrefix}Row` )
```

This pattern is used in places where things (like UI components) are created by iterating over the GenePool. When implementation started on this sim, creating
tandem names in this way was discouraged, because it's impossible to search the code for such a tandem name.  That policy loosened
up late in the implementation, because it forces you to resort to what I call brute-force coding, which results in duplicated/boilerplate code. If I had it to do over, I would
do more iterating over GenePool, and generate more tandem names using string concatenation.  I upgraded to this approach in a few
low-risk places (very!) late in the game, but there were many places (detailed in [natural-selection#224](https://github.com/phetsims/natural-selection/issues/224)) 
where it was just too risky.

**Uninstrumented objects**: Instances that are intentionally not instrumented are instantiated with `tandem: Tandem.OPT_OUT`.

**Configure the Genes for a screen**: [GeneVisibilityManager](https://github.com/phetsims/natural-selection/blob/master/js/common/view/GenesVisibilityManager.js) has a `{{gene}}VisibleProperty` for each Gene, which controls the visiblity of all UI components for that gene. Use these Properties via Studio to quickly configure which genes appear in the UI. Search for "view.genes" in Studio.

**Configure the Environmental Factors for a screen**: Configuring which environmental factors are available for a screen is as easy as deciding which checkboxes to make visible in the "Environmental Factors" panel.  Search for `wolvesCheckbox`, `toughFoodCheckbox`, and `limitedFoodCheckbox` in Studio, and set their visibleProperty as desired.

  
