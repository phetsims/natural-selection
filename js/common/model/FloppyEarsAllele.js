// Copyright 2019-2020, University of Colorado Boulder

/**
 * FloppyEarsAllele is the variation of the ears gene that results in floppy (lop) ears.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelectionStrings from '../../natural-selection-strings.js';
import naturalSelection from '../../naturalSelection.js';
import EarsGene from './EarsGene.js';

class FloppyEarsAllele extends EarsGene {

  constructor() {
    super( naturalSelectionStrings.floppyEars );
  }
}

naturalSelection.register( 'FloppyEarsAllele', FloppyEarsAllele );
export default FloppyEarsAllele;