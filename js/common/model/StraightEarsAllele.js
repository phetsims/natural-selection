// Copyright 2019, University of Colorado Boulder

/**
 * StraightEarsAllele is the variation of the ears gene that results in straight ears.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelectionStrings from '../../natural-selection-strings.js';
import naturalSelection from '../../naturalSelection.js';
import EarsGene from './EarsGene.js';

const straightEarsString = naturalSelectionStrings.straightEars;

class StraightEarsAllele extends EarsGene {

  constructor() {
    super( straightEarsString );
  }
}

naturalSelection.register( 'StraightEarsAllele', StraightEarsAllele );
export default StraightEarsAllele;