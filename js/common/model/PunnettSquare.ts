// Copyright 2020-2022, University of Colorado Boulder

/**
 * A Punnett square predicts the possible genotypes (genetic cross) that result from breeding two bunnies.
 * The square consists of 4 cells, which describe the ways that 2 pairs of alleles may be crossed. For example, here's
 * a Punnett square that shows the 4 possible crosses of 2 bunnies that are heterozygous ('Ff') for the fur gene:
 *
 *        F    f
 *   F | FF | Ff |
 *   f | Ff | ff |
 *
 *  This sim uses a Punnett square to model Mendelian inheritance and the Law of Segregation. The order of cells is
 *  shuffled to satisfy Mendel's Law of Independence, which states that individual traits are inherited independently.
 *
 *  See also the 'Reproduction' section of model.md at
 *  https://github.com/phetsims/natural-selection/blob/master/doc/model.md#reproduction
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import naturalSelection from '../../naturalSelection.js';
import Allele from './Allele.js';
import GenePair from './GenePair.js';

export default class PunnettSquare {

  private readonly cells: Cell[];

  public constructor( fatherGenePair: GenePair, motherGenePair: GenePair ) {

    this.cells = dotRandom.shuffle( [
      new Cell( fatherGenePair.fatherAllele, motherGenePair.fatherAllele ),
      new Cell( fatherGenePair.fatherAllele, motherGenePair.motherAllele ),
      new Cell( fatherGenePair.motherAllele, motherGenePair.fatherAllele ),
      new Cell( fatherGenePair.motherAllele, motherGenePair.motherAllele )
    ] );
  }

  /**
   * Gets a cell by index. Note that the cells are stored in random order.
   */
  public getCell( index: number ): Cell {
    assert && assert( index >= 0 && index < this.cells.length, `invalid index: ${index}` );
    return this.cells[ index ];
  }

  /**
   * Gets a random cell.
   */
  public getRandomCell(): Cell {
    return this.cells[ dotRandom.nextIntBetween( 0, this.cells.length - 1 ) ];
  }

  /**
   * Gets the number of cells.
   */
  public get length(): number {
    return this.cells.length;
  }

  /**
   * Gets the cell in the Punnett square to use for an additional offspring. This is used to create a 5th offspring
   * when a recessive mutant mates eagerly. If the Punnett square contains a homozygous mutation, that genotype is
   * returned. Second choice is a dominant genotype, and a random selection is the last resort.
   */
  public getAdditionalCell( mutantAllele: Allele, dominantAllele: Allele | null ): Cell {

    let cell = null;

    // Look for homozygous mutation
    for ( let i = 0; i < this.length && !cell; i++ ) {
      const currentCell = this.getCell( i );
      if ( currentCell.fatherAllele === mutantAllele && currentCell.motherAllele === mutantAllele ) {
        cell = currentCell;
      }
    }

    // Fallback to dominant genotype
    if ( !cell && dominantAllele ) {
      for ( let i = 0; i < this.length && !cell; i++ ) {
        const currentCell = this.getCell( i );
        if ( currentCell.fatherAllele === dominantAllele || currentCell.motherAllele === dominantAllele ) {
          cell = currentCell;
        }
      }
    }

    // Fallback to random selection
    if ( !cell ) {
      cell = this.getRandomCell();
    }

    assert && assert( cell, 'cell not found' );
    return cell;
  }
}

/**
 * A cell in the Punnett square describes one specific cross (combination of father and mother alleles).
 */
class Cell {

  public readonly fatherAllele: Allele;
  public readonly motherAllele: Allele;

  public constructor( fatherAllele: Allele, motherAllele: Allele ) {
    this.fatherAllele = fatherAllele;
    this.motherAllele = motherAllele;
  }
}

naturalSelection.register( 'PunnettSquare', PunnettSquare );