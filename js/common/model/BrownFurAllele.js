// Copyright 2019-2020, University of Colorado Boulder

/**
 * BrownFurAllele is the variation of the fur gene that results in brown fur.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelectionStrings from '../../natural-selection-strings.js';
import naturalSelection from '../../naturalSelection.js';
import FurGene from './FurGene.js';

class BrownFurAllele extends FurGene {

  constructor() {
    super( naturalSelectionStrings.brownFur );
  }
}

naturalSelection.register( 'BrownFurAllele', BrownFurAllele );
export default BrownFurAllele;