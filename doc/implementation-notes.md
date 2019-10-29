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


Hypothetical model class hierarchy:
```  

// our bunnies have 3 gene types, each with 2 variations (alleles)
abstract Gene
  abstract Allele
    abstract FurAllele
      WhiteFurAllele
      BrownFurAllele  
    abstract EarsAllele
      TallEarsAllele
      FlatEarsAllele
    abstract TeethAllele
      ShortTeethAllele
      LongTeethAllele
        
// bunnies are diploids, so they have pairs of genes, 1 each from father and mother
abstract GenePair { 
  this.fatherGene; // {Gene} 
  this.motherGene; // {Gene}
}
  FurGenePair 
  EarsGenePair
  TeethGenePair
        
// our bunnies have 3 gene types, so 3 pairs of genes
BunnyGenotype {
  this.furGenePair; // {FurGenePair}
  this.earsGenePair; // {EarsGenePair}
  this.teethGenePair; // {TeethGenePair}
}

// how a bunny appears and functions (phenotype) is based on its genotype
Bunny {
  this.genotype; // {BunnyGenotype}
} 
```