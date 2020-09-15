// Copyright 2020, University of Colorado Boulder

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

import naturalSelection from '../../naturalSelection.js';
import Allele from './Allele.js';

class PunnettSquare {

  /**
   * @param {GenePair} fatherGenePair
   * @param {GenePair} motherGenePair
   */
  constructor( fatherGenePair, motherGenePair ) {

    // @private {Cell[]}
    this.cells = phet.joist.random.shuffle( [
      new Cell( fatherGenePair.fatherAllele, motherGenePair.fatherAllele ),
      new Cell( fatherGenePair.fatherAllele, motherGenePair.motherAllele ),
      new Cell( fatherGenePair.motherAllele, motherGenePair.fatherAllele ),
      new Cell( fatherGenePair.motherAllele, motherGenePair.motherAllele )
    ] );
  }

  /**
   * Gets a cell by index. Note that the cells are stored in random order.
   * @param {number} index
   * @returns {Cell}
   * @public
   */
  getCell( index ) {
    assert && assert( index >= 0 && index < this.cells.length, `invalid index: ${index}` );
    return this.cells[ index ];
  }

  /**
   * Gets a random cell.
   * @returns {Cell}
   * @public
   */
  getRandomCell() {
    return this.cells[ phet.joist.random.nextIntBetween( 0, this.cells.length - 1 ) ];
  }

  /**
   * Gets the number of cells.
   * @returns {number}
   * @public
   */
  get length() {
    return this.cells.length;
  }

  /**
   * Gets the cell in the Punnett square to use for an additional offspring. If the Punnett square contains a
   * homozygous mutation, that genotype is returned. Otherwise, read the code comments :)
   * REVIEW: Nice comments :)
   * This is used to create a 5th offspring when a recessive mutant mates eagerly.
   * @param {Allele} mutantAllele
   * @param {Allele|null} dominantAllele
   * @returns {Cell}
   * @public
   */
  getAdditionalCell( mutantAllele, dominantAllele ) {

    assert && assert( mutantAllele instanceof Allele, 'invalid mutantAllele' );
    assert && assert( dominantAllele instanceof Allele || dominantAllele === null, 'invalid dominantAllele' );

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

  /**
   * @param {Allele} fatherAllele
   * @param {Allele} motherAllele
   */
  constructor( fatherAllele, motherAllele ) {

    // @public (read-only)
    this.fatherAllele = fatherAllele;
    this.motherAllele = motherAllele;
  }
}

naturalSelection.register( 'PunnettSquare', PunnettSquare );
export default PunnettSquare;