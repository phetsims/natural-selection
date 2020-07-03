# Natural Selection - model description

This document is a high-level description of the model used in PhET's _Natural Selection_ simulation.

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

In the context of this sim:

* A bunny has 3 traits, and 3 corresponding gene types: fur, ears, teeth.
* A bunny has 6 genes, 2 of each gene type.  One of each type is inherited from each parent.
* Prior to mutation, each gene type has 1 allele type.
* After mutation, each gene type has 2 allele types, with an established dominance relationship. 
* The alleles for fur are 'white fur' (normal) and 'brown fur' (mutation).
* The alleles for ears are 'straight ears' (normal) and 'floppy ears' (mutation).
* The alleles for teeth are 'short teeth' (normal) and 'long teeth' (mutation).
* A bunny's genotype is its complete set of 6 genes (3 pairs).
* A bunny's phenotype is how the bunny appears (fur, ears, and teeth) and functions due to its genotype.

The sim does not support genes with more than 2 allele types.

In Pedigree graph, 'father' is on the left, 'mother' is on the right. Sex is irrelevant.