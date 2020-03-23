// Copyright 2019-2020, University of Colorado Boulder

/**
 * TeethGene is the base class for genes related to teeth.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelectionStrings from '../../natural-selection-strings.js';
import naturalSelection from '../../naturalSelection.js';
import Gene from './Gene.js';

class TeethGene extends Gene {

  /**
   * @param {string} alleleName
   */
  constructor( alleleName ) {
    super( naturalSelectionStrings.teeth, alleleName );
  }
}

naturalSelection.register( 'TeethGene', TeethGene );
export default TeethGene;