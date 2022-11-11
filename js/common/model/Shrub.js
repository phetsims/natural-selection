// Copyright 2020, University of Colorado Boulder

// @ts-nocheck
/**
 * Shrub is the model of a shrub, the food for bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../../naturalSelection.js';
import Organism from './Organism.js';

export default class Shrub extends Organism {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {
    super( modelViewTransform, options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'Shrub', Shrub );