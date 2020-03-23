// Copyright 2019-2020, University of Colorado Boulder

/**
 * ShortTeethAllele is the variation of the teeth gene that results in short teeth.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelectionStrings from '../../natural-selection-strings.js';
import naturalSelection from '../../naturalSelection.js';
import TeethAllele from './TeethAllele.js';

class ShortTeethAllele extends TeethAllele {

  constructor() {
    super( naturalSelectionStrings.shortTeeth );
  }
}

naturalSelection.register( 'ShortTeethAllele', ShortTeethAllele );
export default ShortTeethAllele;