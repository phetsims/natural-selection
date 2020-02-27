// Copyright 2019, University of Colorado Boulder

/**
 * FloppyEarsAllele is the variation of the ears gene that results in floppy (lop) ears.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelectionStrings from '../../natural-selection-strings.js';
import naturalSelection from '../../naturalSelection.js';
import EarsGene from './EarsGene.js';

const floppyEarsString = naturalSelectionStrings.floppyEars;

class FloppyEarsAllele extends EarsGene {

  constructor() {
    super( floppyEarsString );
  }
}

naturalSelection.register( 'FloppyEarsAllele', FloppyEarsAllele );
export default FloppyEarsAllele;