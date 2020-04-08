// Copyright 2020, University of Colorado Boulder

/**
 * Allele is a variation of a gene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';

class Allele {

  /**
   * @param {string} name - name of the allele
   */
  constructor( name ) {

    // @public (read-only)
    this.name = name;
  }
}

// the Alleles for this sim
Allele.WHITE_FUR = new Allele( naturalSelectionStrings.whiteFur );
Allele.BROWN_FUR = new Allele( naturalSelectionStrings.brownFur );
Allele.FLOPPY_EARS = new Allele( naturalSelectionStrings.floppyEars );
Allele.STRAIGHT_EARS = new Allele( naturalSelectionStrings.straightEars );
Allele.SHORT_TEETH = new Allele( naturalSelectionStrings.shortTeeth );
Allele.LONG_TEETH = new Allele( naturalSelectionStrings.longTeeth );

naturalSelection.register( 'Allele', Allele );
export default Allele;