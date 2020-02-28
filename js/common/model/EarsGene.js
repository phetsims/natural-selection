// Copyright 2019-2020, University of Colorado Boulder

/**
 * EarsGene is the base class for genes related to ears.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelectionStrings from '../../natural-selection-strings.js';
import naturalSelection from '../../naturalSelection.js';
import Gene from './Gene.js';

const earsString = naturalSelectionStrings.ears;

class EarsGene extends Gene {

  /**
   * @param {string} alleleName
   */
  constructor( alleleName ) {
    super( earsString, alleleName );
  }
}

naturalSelection.register( 'EarsGene', EarsGene );
export default EarsGene;