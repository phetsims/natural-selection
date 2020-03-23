// Copyright 2019-2020, University of Colorado Boulder

/**
 * FurGene is the base class for genes related to fur (hair) color.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelectionStrings from '../../natural-selection-strings.js';
import naturalSelection from '../../naturalSelection.js';
import Gene from './Gene.js';

class FurGene extends Gene {

  /**
   * @param {string} alleleName
   */
  constructor( alleleName ) {
    super( naturalSelectionStrings.fur, alleleName );
  }
}

naturalSelection.register( 'FurGene', FurGene );
export default FurGene;