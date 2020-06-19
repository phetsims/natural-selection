// Copyright 2020, University of Colorado Boulder

/*
 * FastForwardButton is the fast-forward button. To make the sim run faster, press and hold this button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RoundMomentaryButton from '../../../../sun/js/buttons/RoundMomentaryButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';

class FastForwardButton extends RoundMomentaryButton {

  /**
   * @param {Property.<boolean>} fastForwardScaleProperty
   * @param {number} fastScale - how much to scale time when the button is pressed
   * @param {Object} [options]
   */
  constructor( fastForwardScaleProperty, fastScale, options ) {
    assert && AssertUtils.assertPropertyOf( fastForwardScaleProperty, 'number' );
    assert && assert( NaturalSelectionUtils.isPositive( fastScale ), 'invalid fastScale' );

    options = merge( {
      radius: 16,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // Two right-pointing arrow heads, drawn clockwise from the top-left corner.
    const r = options.radius;
    const fastForwardShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( r / 2, r / 2 )
      .lineTo( r / 2, 0 )
      .lineTo( r, r / 2 )
      .lineTo( r / 2, r )
      .lineTo( r / 2, r / 2 )
      .lineTo( 0, r )
      .close();

    assert && assert( !options.content, 'FastForwardButton sets content' );
    options.content = new Path( fastForwardShape, {
      fill: 'black'
    } );

    super( 1, fastScale, fastForwardScaleProperty, options );

    this.addLinkedElement( fastForwardScaleProperty, {
      tandem: options.tandem.createTandem( 'fastForwardScaleProperty' )
    } );
  }
}

naturalSelection.register( 'FastForwardButton', FastForwardButton );
export default FastForwardButton;