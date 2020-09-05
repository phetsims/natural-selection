# Natural Selection - model description

@author Chris Malley (PixelZoom, Inc.)

This document is a high-level description of the model used in PhET's _Natural Selection_ simulation.
It's assumed that the reader has some basic knowledge of genetics.

## Time

Time is measured in _**generations**_. Each revolution of the _**generation clock**_ 
(shown at the top center of the user interface) corresponds to the passage of 1 generation.

Various events are described as times relative to the "wall clock" time on the generation clock. 
For example, "bunnies reproduce at 12:00", or "wolves eat at 4:00".

Because compute memory is finite, the simulation has a limit of 1000 generations. 
If the generation clock reaches 1000, the simulation stops, a dialog is displayed, and the student can review the final state.

## Genes and Alleles

* A _**trait**_ is a characteristic or feature of an organism. For example, "blue eyes" or "brown fur".
* A _**gene**_ is the unit of heredity that is transferred from a parent to its offspring, and controls the expression
of a trait. Our 3 genes are: fur, ears, teeth.
* The set of different genes that exist in the population is the _**gene pool**_.
* Variants of a gene are called _**alleles**_. For example "white fur" and "brown fur" are alleles of the fur gene.
(Note that gene and allele are often used interchangeably in the literature, but we attempt to use them 
consistently as defined herein.) 
* A _**normal**_ (aka "wild type") allele is present in the natural population. 
For our bunnies, the normal alleles are: white fur, straight ears, short teeth.
* A _**mutant**_ allele is any allele that is not normal. 
For our bunnies, the mutant alleles are: brown fur, floppy ears, long teeth.
* Each individual has 2 alleles for each gene, one allele inherited from each parent. These 2 alleles are 
referred to as a _**gene pair**_.
* If an individual's alleles are identical, it is _**homozygous**_. If its alleles are different, 
it is _**heterozygous**_.
* _**Dominance**_ is the effect of one allele masking the expression of a different allele. 
The first allele is referred to as _**dominant**_ and the second is _**recessive**_. Note that since dominance
is a relationship between 2 alleles, it is impossible to have a dominance relationship until a mutant allele
has been introduced.

## Genotype and Phenotype

_**Genotype**_ is a complete set of genes, the blueprint for an organism. 
The blueprint consists of a gene pair for each gene. 
A genotype can be abbreviated by using letters to represent an individual's alleles. 
Conventions for abbreviation vary, and the section below describes the convention used in this simulation.

_**Phenotype**_ is the appearance of the organism, the manifestation of the genotype. For homozygous individuals, appearance is straightforward, since 
the alleles are identical. For heterozygous individuals, appearance is determined by the dominant allele.

Genotype abbreviation:

* Each gene has a pair of letters that are used to label its 2 alleles: 
'F' and 'f' for fur, 'E' and e' for ears, 'T' and 't' for teeth.
* Dominant alleles are denoted by a capital letter, recessive alleles by a lowercase letter. 
For example, if the "brown fur" mutation is dominant, then 'F' means brown fur, and 'f' means white fur.
* Letters can be assigned to alleles only after a dominance relationship exists. 
For example, if the population consists of white bunnies, and the brown fur mutation has not yet occurred, 
then it's impossible to label the white bunnies as 'F' or 'f', because "white fur" is not yet involved in a 
dominance relationship. In this case, the allele does not appear in the abbreviation.
* For genes where a dominance relationship exists, the genotype is abbreviated using the 
letters mentioned above.  For example if brown fur is dominant (F), floppy ears are dominant (E), and long 
teeth are recessive (t), then genotype "FFEett" is parsed as:
  * FF = 2 alleles for brown fur
  * Ee = 1 allele for floppy ears, 1 allele for straight ears
  * tt = 2 alleles for long teeth
* The order of letters in our genotype abbreviations is relevant, and identifies the parent who contributed
the allele. For example, 'Ff' is different than 'fF'. The first allele is inherited from the father, 
the second from the mother.

## Life Expectancy

In reality, environmental factors may affect life expectancy. That is not the case in this simulation.
All bunnies have an identical life expectancy of 5 generations. 
If a bunny makes it to 5 generations old, it dies of old age. Bunnies die at 12:00,
just before reproduction occurs.

## Reproduction

In reality, environmental factors may affect reproduction. That is not the case in this simulation. Reproduction
is not affected by environmental factors, and bunnies reproduce according to the following model:

* Bunnies reproduce at 12:00.
* Each bunny mates once per generation. If the number of bunnies is odd, then 1 bunny will not mate. 
* Any bunny can mate with any other bunny. Age, sex, and pedigree relationship are irrelevant.
* For convenience, we refer to the two parents as _**father**_ and _**mother**_. In the _Pedigree_ 
graph, the father is on the left, the mother is on the right. In genotype abbreviations (e.g. 'Ff'),
the allele inherited from the father is first, the mother is second.
* When bunnies mate, they produce 4 offspring. Mating follows 
[Mendelian Inheritance](https://en.wikipedia.org/wiki/Mendelian_inheritance), 
 with cross breeding as described by a [Punnett Square](https://en.wikipedia.org/wiki/Punnett_square).
 For example, this Punnett Square describes the fur gene pairs for the 4 offspring of an 'FF' father and 'Ff' mother:
 
| | **F** | **F** |
|---|---|---|
| **F** | FF | FF |
| **f** | Ff | Ff|

* Bunnies take over the world when the population (after mating) is 750 or greater. All bunnies mate before considering whether bunnies have taken over the world. When this happens, the simulation stops, a dialog is displayed, and the student can review the final state.
* Similarly, if all bunnies die, the simulation stops, a dialog is displayed, and the student can review the final state.

## Mutation

_**Mutation**_ occurs when a mutant allele is introduced into the population. A mutant allele results from 
errors during DNA replication, mitosis, and meiosis, or other types of damage to DNA. 

In this simulation, mutations are introduced
by the user, via the _Add Mutations_ panel. The user pushes a button to indicate whether a mutant allele 
is dominant or recessive with respect to the corresponding normal allele. The mutation is 
then introduced the next time that bunnies reproduce.  

A mutation is introduced by randomly selecting one newborn bunny to received the mutation. One of
that bunny's inherited alleles is selected randomly and replaced with the mutant allele.
Multiple mutations may occur at the same time, but an individual will not receive more than one mutation.

### Recessive Mutants

When the user specifies that a mutation should be recessive, a recessive mutant is born.
Since the mutation is recessive, it will not appear in the phenotype of the newborn bunny, and in fact cannot
not appear in the population until 2 generations later, when another bunny has the same mutant allele.
Rather than leave it to chance that the recessive mutants will be paired up, a newborn recessive mutant is 
prioritized to mate as soon as possible with another bunny that has the same mutant allele, so that the mutation 
appears in the phenotype as soon as possible. We refer to this prioritization as "mating eagerly".

When a recessive mutant mates eagerly, it produces 5 offspring. The first 4 are as in the 
Punnett Square described above, and will include 1 homozygous recessive bunny. The 5th offspring is 
also homozygous recessive, in order to make the recessive allele propagate through the phenotype more quickly.

A recessive mutant mates eagerly only once. Thereafter it mates like any other bunny.

## Environmental Factors

An _**environmental factor**_ (aka selective agent) is something in the environment that results in 
preferential survival and reproduction or preferential elimination of individuals with certain genotypes.
The environmental factors in this simulation affect bunny mortality, by selecting bunnies and 
eliminating them. Each environmental factor has a corresponding "slice" of the generation clock (shown
on the clock) during which it is applied. 

Environmental factors are applied in this order: wolves, tough food, limited food.

### Wolves

The wolves "slice" of the generation clock occurs from 2:00-6:00, which is when you'll see them
roaming around hunting. They eat at 4:00, and this is where you'll see data points related to 
wolves on the Population graph.

The number of wolves is proportional to the number of bunnies, with a minimum number of wolves.
The calculation is:

`numberOfWolves = max( 5, round( numberOfBunnies / 10 ) )`

Bunnies whose fur color matches their environment ("matching bunnies") have an adaptive advantage.
It's easier for wolves to see bunnies whose fur color does not match their environment, so they eat more of them.
If the population of matching bunnies is small (less than 6) and there are other bunnies to eat, 
then the matching bunnies will be ignored.

In pseudocode†, here's the algorithm for calculating the percentages [0,1] of bunnies to eat:

```
// Wolves

// the quantities that this algorithm computes, with their default values
percentToEatBrown = 0
percentToEatWhite = 0

if ( wolves are enabled ) {

  percentToEat = randomNumberBetween( 0.35, 0.4 )
  multiplierForNonFavoredBunnies = 2.3

  if ( environment color is brown ) {
    percentToEatWhite = multiplierForNonFavoredBunnies * percentToEat
    percentToEatBrown = percentToEat
    if ( number of brown bunnies < 6 AND number of white bunnies > 0 ) {
      percentToEatBrown = 0
    }
  }
  else {
    percentToEatBrown = multiplierForNonFavoredBunnies * percentToEat
    percentToEatWhite = percentToEat
    if ( number of white bunnies < 6 AND number of brown bunnies > 0 ) {
      percentToEatWhite = 0
    }
  }
}
```

### Food 

The food "slice" of the generation clock occurs from 6:00-10:00. Food is applied at 8:00, and this is where
you'll see data points related to food on the Population graph.

Food consists of two factors: tough food and limited food. They are applied independently and in that order. Both factors may result in bunnies dying of starvation.

### Tough Food

Tough food is more difficult to eat, so some of each phenotype will starve. But bunnies with short teeth are less adapted to eating tough food, 
so a larger percentage of bunnies with short teeth will starve. Additionally, if the number of bunnies with long teeth is small (less than 5),
then no bunnies with long teeth will starve. 

In pseudocode†, here's the algorithm for calculating the percentages [0,1] of bunnies that will starve from tough food:

```
// Tough Food

// the quantities that this algorithm computes, with their default values
percentShortTeethStarved = 0
percentLongTeethStarved = 0

if ( tough food is enabled ) {
  percentToStarve = randomNumberBetween( 0.4, 0.45 )
  percentShortTeethStarved = percentToStarve * 2
  percentLongTeethStarved = percentToStarve
  if ( number of bunnies with long teeth < 5 ) {
    percentLongTeethStarved = 0
  }
}
```

### Limited Food

Limited food can support a population up to a carrying capacity, and does not favor any phenotype. If the population exceeds the carrying capacity, then
bunnies die off to reduce the population to the carrying capacity.  The carrying capacity is randomly selected from a range to provide some
variability.

In pseudocode†, here's the algorithm for calculating the number of bunnies that will die due to limited food:

```
// Limited Food

// the quantity that this algorithm computes, with its default value
numberToStarve = 0

if ( limited food is enabled ) {
  carryingCapacity = randomNumberBetween( 90, 110 )
  if ( total number of bunnies > carryingCapacity ) {
    numberToStarve = total number of bunnies - carryingCapacity
  }
}
```

†The constants shown in the above pseudocode were accurate at the time of writing. We'll try to keep those values in sync with reality. But it's possible that someone might update the code without updating this document.

## Graphs

### Population graph

The Population graph shows how population (y-axis, in number of bunnies) changes over time (x-axis, in generations). There is a plot for total number of bunnies, and a plot for each allele.  Data points occur at the following times/events whenever there is a change in the number of bunnies:

| Time | Event |
| :--- | :--- |
| 12:00 | bunnies die of old age and reproduce |
| 4:00 | wolves eat bunnies |
| 8:00 | food factors result in bunnies starving |

### Proportions graph

The Proportions graph shows the proportions of alleles for each gene at the start and end of each generation. For the current generation, it shows the current proportion corresponding to the generation clock time.  The start proportion is computed at 12:00, immeditely _after_ bunnies die of old age and reproduce. The end proportion is computed at 12:00, immediate _before_ bunnies die of old age and reproduce.

### Pedigree graph

The Pedigree graph shows a bunny's pedigree to a maximum depth of 3 ancestors. The pedigree optionally shows the genotype abbreviation. 
A red 'X' on a bunny indicates that the bunny is dead. A yellow 'mutaton' icon indicates a mutant bunny. 

## Bibliography

Some of the resources that were used in the creation of this simulation...

**Books**

* _[Molecular and Cell Biology for Dummies, 1st Edition](https://www.academia.edu/5107380/Molecular_and_Cell_Biology_for_Dummies)_ (free download)
* _[Genetics for Dummies, 2nd Edition](https://epdf.pub/genetics-for-dummies-second-edition.html)_ (free download)
* _[Cartoon Guide to Genetics](https://archive.org/details/The_Cartoon_Guide_To_Genetics_Larry_Gonick/page/n211)_ (free download)
* _The Selfish Gene_, Richard Dawkins

**Wikipedia**

* [Natural Selection](https://en.wikipedia.org/wiki/Natural_selection)
* [Mendelian Inheritance](https://en.wikipedia.org/wiki/Mendelian_inheritance)
* [Trait](https://en.wikipedia.org/wiki/Phenotypic_trait)
* [Gene](https://en.wikipedia.org/wiki/Gene)
* [Allele](https://en.wikipedia.org/wiki/Allele)
* [Genotype](https://en.wikipedia.org/wiki/Genotype)
* [Phenotype](https://en.wikipedia.org/wiki/Phenotype)
* [Dominance](https://en.wikipedia.org/wiki/Dominance_(genetics))
* [Mutation](https://en.wikipedia.org/wiki/Mutation)
