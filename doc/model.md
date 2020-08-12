# Natural Selection - model description

This document is a high-level description of the model used in PhET's _Natural Selection_ simulation.
It's assumed that the reader has some basic knowledge of genetics.

## Time

Time is measured in _**generations**_. Each revolution of the _**generation clock**_ 
(shown at the top center of the user interface) corresponds to the passage of 1 generation. 

## Genes and Alleles

* A _**trait**_ is a characteristic or feature of an organism. For example, "blue eyes" or "brown fur".
* A _**gene**_ is the unit of heredity that is transferred from a parent to an offspring, and controls the expression
of a trait. Our 3 genes are: fur, ears, teeth.
* Variants of a gene are called _**alleles**_. For example "white fur" and "brown fur" are alleles of the fur gene.
(Note that gene and allele are often used interchangeably in the literature, but we attempt to use them 
consistently in this simulation.) 
* Each individual has 2 alleles for each gene, one allele inherited from each parent. These 2 alleles are 
referred to as a _gene pair_.
* If an individual's alleles are identical, it is _**homozygous**_. If its alleles are different, 
it is _**heterozygous**_.
* A _**normal**_ (aka "wild type") allele is present in the natural population. 
For our bunnies, the normal alleles are: white fur, straight ears, short teeth.
* A _**mutant**_ allele is any allele that is not normal. 
For our bunnies, the mutant alleles are: brown fur, floppy ears, long teeth.  
* Mutation occurs when a mutant allele is introduced into the population. Mutations result from errors during DNA 
replication, mitosis, and meiosis or other types of damage to DNA. In this simulation, mutations are introduced
by the user, via the _Add Mutation_ panel.  When a mutation is introduced, the user specifies whether the mutant allele 
is _**dominant**_ or _**recessive**_ with respect to the corresponding normal allele. For example, mutation "brown fur" 
can be dominant or recessive with respect to "white fur".
* The collection of alleles that exist is referred to as the _**gene pool**_.

## Genotype and Phenotype

_**Genotype**_ is a complete set of genes, the blueprint for an organism. 
The blueprint consists of a gene pair for each gene. 
A genotype can be abbreviated by using letters to represent an individual's alleles. 
Conventions for abbreviation vary, and the section below describes the convention used in this simulation.

_**Phenotype**_ is the appearance of the organism. For homozygous individuals, appearance is straightforward, since 
the alleles are identical. For heterozygous individuals, appearance is determined by the dominant allele.

Genotype abbreviation:

* Each gene has a pair of letters that are used to label its alleles: 
'F' and 'f' for fur, 'E' and e' for ears, 'T' and 't' for teeth.
* Dominant alleles are denoted by a capital letter, recessive alleles by a lowercase letter. 
For example, if the "brown fur" mutation is dominant, then 'F' means brown fur, and 'f' means white fur.
* Letters can be assigned to alleles only after a dominant/recessive relationship exists between 2 alleles. 
For example, if the population consists of white bunnies, and the brown fur mutation has not yet occurred, 
then it's impossible to label the white bunnies as 'F' or 'f', because "white fur" is not yet involved in a 
dominant/recessive relationship.
* For genes where a dominant/recessive relationship exists, the genotype is abbreviated using the 
letters mentioned above.  For example if brown fur is dominant (F), floppy ears are dominant (E), and long 
teeth are recessive (t), then genotype "FFEett" is parsed as:
  * FF = 2 alleles for brown fur
  * Ee = 1 allele for floppy ears, 1 allele for straight ears
  * tt = 2 alleles for long teeth
... and the bunny's phenotype (appearance) will be brown fur, floppy ears, long teeth.
* The order of letters in our genotype abbreviations is relevant. 'Ff' is different than 'fF'. 
In this sim, the first allele ('f') is inherited from the father, the second ('F') from the mother.

## Life Expectancy

All bunnies have identical life expectancy, which is not influenced by other factors. 
If a bunny makes it to 5 generations old, it dies of old age. Bunnies die at 12:00 on the generation clock,
just before reproduction occurs.

## Reproduction

* Bunnies reproduce at 12:00 on the generation clock.
* Any bunny can mate with any other bunny. Age, sex, and pedigree relationship are irrelevant.
* For convenience, we refer to the two parents as _**father**_ and _**mother**_. In the _Pedigree_ 
graph, the father is on the left, the mother is on the right. 
* When bunnies mate, they produce 4 offspring. Mating follows 
[Mendelian Inheritance](https://en.wikipedia.org/wiki/Mendelian_inheritance), 
 with cross breeding as described by a [Punnett Square](https://en.wikipedia.org/wiki/Punnett_square).
 For example, this Punnett Square describes the 4 offspring for an 'FF' father and 'Ff' mother:
 
| | **F** | **F** |
|---|---|---|
| **F** | FF | FF |
| **f** | Ff | Ff|

## Environmental Factors

An environmental factor (aka factor, selection factor, or selection agent) is something that affects fertility
or mortality. There are no factors in this simulation that affect fertility. All factors result affect 
mortality by selecting bunnies and killing them. 

## Food

## Wolves

## Recessive Mutants
