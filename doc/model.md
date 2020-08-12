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
consistently as defined herein.) 
* The complete collection of alleles that exist is referred to as the _**gene pool**_.
* Each individual has 2 alleles for each gene, one allele inherited from each parent. These 2 alleles are 
referred to as a _**gene pair**_.
* If an individual's alleles are identical, it is _**homozygous**_. If its alleles are different, 
it is _**heterozygous**_.
* A _**normal**_ (aka "wild type") allele is present in the natural population. 
For our bunnies, the normal alleles are: white fur, straight ears, short teeth.
* A _**mutant**_ allele is any allele that is not normal. 
For our bunnies, the mutant alleles are: brown fur, floppy ears, long teeth.  
* _**Dominance**_ is the effect of one allele masking the expression of a different allele. 
The first allele is referred to as _**dominant**_ and the second is _**recessive**_. Note that since dominance
is a relationship between 2 alleles, it is impossible to have a dominance relationship until a mutant allele
has been introduced.

## Genotype and Phenotype

_**Genotype**_ is a complete set of genes, the blueprint for an organism. 
The blueprint consists of a gene pair for each gene. 
A genotype can be abbreviated by using letters to represent an individual's alleles. 
Conventions for abbreviation vary, and the section below describes the convention used in this simulation.

_**Phenotype**_ is the appearance of the organism. For homozygous individuals, appearance is straightforward, since 
the alleles are identical. For heterozygous individuals, appearance is determined by the dominant allele.

Genotype abbreviation:

* Each gene has a pair of letters that are used to label its 2 alleles: 
'F' and 'f' for fur, 'E' and e' for ears, 'T' and 't' for teeth.
* Dominant alleles are denoted by a capital letter, recessive alleles by a lowercase letter. 
For example, if the "brown fur" mutation is dominant, then 'F' means brown fur, and 'f' means white fur.
* Letters can be assigned to alleles only after a dominance relationship exists. 
For example, if the population consists of white bunnies, and the brown fur mutation has not yet occurred, 
then it's impossible to label the white bunnies as 'F' or 'f', because "white fur" is not yet involved in a 
dominance relationship.
* For genes where a dominance relationship exists, the genotype is abbreviated using the 
letters mentioned above.  For example if brown fur is dominant (F), floppy ears are dominant (E), and long 
teeth are recessive (t), then genotype "FFEett" is parsed as:
  * FF = 2 alleles for brown fur
  * Ee = 1 allele for floppy ears, 1 allele for straight ears
  * tt = 2 alleles for long teeth
* The order of letters in our genotype abbreviations is relevant, and identifies the parent who contributed
the allele. For example, 'Ff' is different than 'fF'. The first allele ('f') is inherited from the father, 
the second ('F') from the mother.

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

## Mutation

_**Mutation**_ occurs when a mutant allele is introduced into the population. A mutant allele results from 
errors during DNA replication, mitosis, and meiosis, or other types of damage to DNA. 

In this simulation, mutations are introduced
by the user, via the _Add Mutations_ panel. The user specifies whether a mutant allele 
is dominant or recessive with respect to the corresponding normal allele. The mutation is 
then introduced the next time that bunnies reproduce.

## Environmental Factors

An _**environmental factor**_ (aka selective agent) is something in the environment that results in the 
preferential survival and reproduction or preferential elimination of individuals with certain genotypes.
All environmental factors in this simulation affect bunny mortality, by selecting bunnies and 
eliminating them. 

## Food

## Wolves

## Recessive Mutants
