// Copyright 2019-2020, University of Colorado Boulder

/**
 * WhiteFurAllele is the variation of the fur gene that results in white fur.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelectionStrings from '../../natural-selection-strings.js';
import naturalSelection from '../../naturalSelection.js';
import FurGene from './FurGene.js';

class WhiteFurAllele extends FurGene {

  constructor() {
    super( naturalSelectionStrings.whiteFur );
  }
}

naturalSelection.register( 'WhiteFurAllele', WhiteFurAllele );
export default WhiteFurAllele;