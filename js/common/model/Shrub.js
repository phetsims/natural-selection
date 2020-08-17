// Copyright 2020, University of Colorado Boulder

/**
 * Shrub is the model of a shrub, the food for bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import Organism from './Organism.js';

class Shrub extends Organism {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {

    options = merge( {

      //TODO https://github.com/phetsims/natural-selection/issues/176 if we use fixed locations for shrubs, remove instrumentation
      tandem: Tandem.REQUIRED,
      phetioReadOnly: true,
      phetioState: false // because Shrubs never move
    }, options );

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
export default Shrub;