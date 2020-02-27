// Copyright 2019, University of Colorado Boulder

/**
 * TeethGene is the base class for genes related to teeth.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelectionStrings from '../../natural-selection-strings.js';
import naturalSelection from '../../naturalSelection.js';
import Gene from './Gene.js';

const teethString = naturalSelectionStrings.teeth;

class TeethGene extends Gene {

  /**
   * @param {string} alleleName
   */
  constructor( alleleName ) {
    super( teethString, alleleName );
  }
}

naturalSelection.register( 'TeethGene', TeethGene );
export default TeethGene;