// Copyright 2019, University of Colorado Boulder

/**
 * LongTeethAllele is the variation of the teeth gene that results in long teeth.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelectionStrings from '../../natural-selection-strings.js';
import naturalSelection from '../../naturalSelection.js';
import TeethGene from './TeethGene.js';

const longTeethString = naturalSelectionStrings.longTeeth;

class LongTeethAllele extends TeethGene {

  constructor() {
    super( longTeethString );
  }
}

naturalSelection.register( 'LongTeethAllele', LongTeethAllele );
export default LongTeethAllele;