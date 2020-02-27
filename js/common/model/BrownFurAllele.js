// Copyright 2019, University of Colorado Boulder

/**
 * BrownFurAllele is the variation of the fur gene that results in brown fur.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelectionStrings from '../../natural-selection-strings.js';
import naturalSelection from '../../naturalSelection.js';
import FurGene from './FurGene.js';

const brownFurString = naturalSelectionStrings.brownFur;

class BrownFurAllele extends FurGene {

  constructor() {
    super( brownFurString );
  }
}

naturalSelection.register( 'BrownFurAllele', BrownFurAllele );
export default BrownFurAllele;