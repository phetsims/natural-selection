// Copyright 2020, University of Colorado Boulder

/**
 * Shrub is the model of a shrub, the food for bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Organism from './Organism.js';

// Each shrub is assigned a category, which determines which images it uses for tender and tough food.
// The categories are specified in https://github.com/phetsims/natural-selection/issues/17.
// This is not an Enumeration because values are used as keys in ShrubSpritesMap.js.
const CATEGORIES = [ 'A', 'B', 'C' ];

class Shrub extends Organism {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {

    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

    options = merge( {
      category: 'A'
    }, options );

    assert && assert( CATEGORIES.includes( options.category ), 'invalid category' );

    super( modelViewTransform, options );

    // @public (read-only)
    // Used for image lookup, as specified in https://github.com/phetsims/natural-selection/issues/17
    this.category = options.category;
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

// Used for image lookup, as specified in https://github.com/phetsims/natural-selection/issues/17
Shrub.CATEGORIES = CATEGORIES;

naturalSelection.register( 'Shrub', Shrub );
export default Shrub;