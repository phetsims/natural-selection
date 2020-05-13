// Copyright 2020, University of Colorado Boulder

/**
 * BunnyPressListener is the scenery input listener for selecting a bunny.
 *
 * Creating a PressListener for every BunnyNode was found to be expensive because there are a large number of them,
 * so a single listener is added to the parent of BunnyNode instances.  This listener therefore walks the scenery
 * event Trail to identify the BunnyNode that was pressed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import PressListener from '../../../../scenery/js/listeners/PressListener.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyNode from './BunnyNode.js';

class BunnyPressListener extends PressListener  {

  /**
   * @param {Property.<Bunny>} selectedBunnyProperty
   * @param {Object} [options]
   */
  constructor( selectedBunnyProperty, options ) {

    assert && assert( selectedBunnyProperty instanceof Property, 'invalid selectedBunnyProperty' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    assert && assert( !options.press, 'BunnySelectionListener sets press' );
    options.press = event => {

      // Find the BunnyNode closest to the foreground that was pressed.
      const bunnyNode = _.findLast( event.trail.nodes, node => node instanceof BunnyNode );
      if ( bunnyNode ) {
        selectedBunnyProperty.value = bunnyNode.bunny;
        bunnyNode.moveToFront();
      }
    };

    super( options );
  }
}

naturalSelection.register( 'BunnySelectionListener', BunnyPressListener );
export default BunnyPressListener;