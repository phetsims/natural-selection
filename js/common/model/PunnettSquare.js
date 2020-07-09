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
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

class PunnettSquare {

  /**
   * @param {GenePair} fatherGenePair
   * @param {GenePair} motherGenePair
   */
  constructor( fatherGenePair, motherGenePair ) {

    // @private
    this.cells = phet.joist.random.shuffle( [
      new Cell( fatherGenePair.fatherAllele, motherGenePair.fatherAllele ),
      new Cell( fatherGenePair.fatherAllele, motherGenePair.motherAllele ),
      new Cell( fatherGenePair.motherAllele, motherGenePair.fatherAllele ),
      new Cell( fatherGenePair.motherAllele, motherGenePair.motherAllele )
    ] );
    assert && assert( this.cells.length === NaturalSelectionConstants.LITTER_SIZE, 'invalid ' );
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