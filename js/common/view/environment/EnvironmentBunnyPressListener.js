// Copyright 2020, University of Colorado Boulder

//TODO https://github.com/phetsims/natural-selection/issues/128 delete, replaced by Sprites
/**
 * EnvironmentBunnyPressListener is the scenery input listener for selecting a bunny in the environment.
 *
 * Creating a PressListener for every EnvironmentBunnyNode was found to be expensive because there are a large number
 * of them, so a single listener is added to the parent of BunnyNode instances.  This listener therefore walks the
 * scenery event Trail to identify the EnvironmentBunnyNode that was pressed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import PressListener from '../../../../../scenery/js/listeners/PressListener.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import SelectedBunnyProperty from '../../model/SelectedBunnyProperty.js';
import EnvironmentBunnyNode from './EnvironmentBunnyNode.js';

class EnvironmentBunnyPressListener extends PressListener  {

  /**
   * @param {SelectedBunnyProperty} selectedBunnyProperty
   * @param {Object} [options]
   */
  constructor( selectedBunnyProperty, options ) {

    assert && assert( selectedBunnyProperty instanceof SelectedBunnyProperty );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    assert && assert( !options.press, 'BunnySelectionListener sets press' );
    options.press = event => {

      // Find the EnvironmentBunnyNode closest to the foreground that was pressed.
      const bunnyNode = _.findLast( event.trail.nodes, node => node instanceof EnvironmentBunnyNode );
      if ( bunnyNode ) {
        selectedBunnyProperty.value = bunnyNode.bunny;
        bunnyNode.moveToFront();
      }
    };

    super( options );
  }
}

naturalSelection.register( 'EnvironmentBunnyPressListener', EnvironmentBunnyPressListener );
export default EnvironmentBunnyPressListener;