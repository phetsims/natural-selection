// Copyright 2019-2020, University of Colorado Boulder

/**
 * StraightEarsAllele is the variation of the ears gene that results in straight ears.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelectionStrings from '../../natural-selection-strings.js';
import naturalSelection from '../../naturalSelection.js';
import EarsGene from './EarsGene.js';

class StraightEarsAllele extends EarsGene {

  constructor() {
    super( naturalSelectionStrings.straightEars );
  }
}

naturalSelection.register( 'StraightEarsAllele', StraightEarsAllele );
export default StraightEarsAllele;