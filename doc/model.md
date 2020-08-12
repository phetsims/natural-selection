# Natural Selection - model description

This document is a high-level description of the model used in PhET's _Natural Selection_ simulation.
It's assumed that the reader has some basic knowledge of genetics.

## Terminology

* trait - a characteristic or feature that can be passed from one generation to another
* gene - a message for a particular trait, made up of DNA
* allele - a variant of a gene
* normal allele - TODO
* mutant allele - TODO
* gene pair - TODO
* original mutant - TODO
* genotype - the total of all the genetic messages in an organism; the total blueprint for the organism
* phenotype - the way the organism appears and functions because of its genes; what is built from the genotype
* selection agent - any factor, environmental or otherwise, that affects fertility or mortality
* gene pool - the collection of all the genes (and various allelic forms of those genes) within a population
* genotype - TODO
* phenotype - TODO
* Dominance is the phenomenon of one allele of a gene on a chromosome masking or overriding the effect of a 
different allele on the other copy of the chromosome. The first allele is termed dominant and the second 
recessive. Dominance is not inherent to either an allele or its phenotype. Dominance is a relationship between 
two alleles and their associated phenotypes. A dominant allele hides a recessive allele and determines the 
organism's appearance.
* diploid - having 2 sets of chromosomes
* homozygous - When an organism has two copies of the same allele, it is said to be homozygous for that gene.
* heterozygous - When an organism has two different alleles, it is said to be heterozygous for that gene.
* mutation - changes in traits resulting from changes in DNA
* Mendelian Genetics (Gregor Mendel), https://en.wikipedia.org/wiki/Mendelian_inheritance

* FF - homozygous dominant
* ff - homozygous recessive
* Ff, fF - heterozygous

## Genes: Alleles, Genotype, and Phenotype

* The 3 genes types in the sim are: fur, ears, teeth.
* Variants of a gene type are called _alleles_. For example "white fur" and "brown fur" are alleles of the fur gene. 
* Each bunny has 2 alleles for each gene, one allele inherited from each parent. These 2 alleles are 
referred to as a _gene pair_.
* If a bunny's alleles are identical, it is _homozygous_; if its alleles are different, it is _heterozygous_.
* A _normal_ (aka "wild type") allele is present in the natural population. For our bunnies, 
the normal alleles are: white fur, straight ears, short teeth.
* A _mutant_ allele is any allele that is not normal. For our bunnies, the mutant alleles are:
 brown fur, floppy ears, long teeth.  
* Mutation occurs when a mutant allele is introduced into the population. Mutations result from errors during DNA 
replication, mitosis, and meiosis or other types of damage to DNA. In this sim, mutations are introduced
by the user.  When a mutation is introduced, the user specifies whether the mutant allele is _dominant_ or 
_recessive_ with respect to the corresponding normal allele. For example, mutation "brown fur" can be dominant 
or recessive with respect to "white fur".
* _Genotype_ is a complete set of genes, the blueprint for an organism. The blueprint consists of 2 alleles for each gene. 
* _Phenotype_ is the appearance of the organism. For homozygous individuals, appearance is straightforward, since 
they have 2 identical alleles. For heterozygous individuals, appearance is determined by the dominant allele.

# Genotype Abbreviation

* A genotype can be abbreviated by using letters to represent the bunny's alleles. Standards for abbreviation
vary, and this section describes the abbreviation used in this simulation.
* Each gene has a pair of letters that are used to label its alleles: 
'F' and 'f' for fur, 'E' and e' for ears, 'T' and 't' for teeth.
* Dominant alleles are denoted by a capital letter, recessive alleles by a lowercase letter. 
For example, if the "brown fur" mutation is dominant, then 'F' means brown fur, and 'f' means white fur.
* Letters can be assigned to alleles only after a dominant/recessive relationship exists between 2 alleles. 
For example, if the population consists of white bunnies, and the brown fur mutation has not yet occurred, 
then it's impossible to label the white bunnies as 'F' or 'f', because "white fur" is not yet involved in a 
dominant/recessive relationship.
* For genes where a dominant/recessive relationship exists, the genotype is abbreviated using the allele 
letters mentioned above.  For example if brown fur is dominant (F), floppy ears are dominant (E), and long 
teeth are recessive (t), then genotype "FFEett" is parsed as:
  * FF = 2 alleles for brown fur
  * Ee = 1 allele for floppy ears, 1 allele for straight ears
  * tt = 2 alleles for long teeth
... and the bunny's phenotype (appearance) will be brown fur, floppy ears, long teeth.


Mating follows Mendelian inheritance, see Punnett square.

Bunnies die when 5 years old.

Any bunny can mate with any other bunny. Age is irrelevant. Sex is irrelevant, but the code refers 
to the 2 parents as 'father' and 'mother'. In Pedigree graph, 'father' is on the left, 'mother' is 
on the right.

Order of alleles in genotype abbreviations is relevant. 'Ff' is different than 'fF'. The first 
allele is inherited from the father, the second from the mother.

Describe special handling of recessive mutations.

Describe wolves.
 
Describe food.