// Copyright 2020-2022, University of Colorado Boulder

/*
 * FastForwardButton is the fast-forward button. To make the sim run faster, press and hold this button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import { Path } from '../../../../scenery/js/imports.js';
import RoundMomentaryButton from '../../../../sun/js/buttons/RoundMomentaryButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';

class FastForwardButton extends RoundMomentaryButton {

  /**
   * @param {EnumerationProperty.<TimeSpeed>} timeSpeedProperty
   * @param {Object} [options]
   */
  constructor( timeSpeedProperty, options ) {
    assert && assert( timeSpeedProperty instanceof EnumerationProperty );

    options = merge( {
      radius: 16,
      xMargin: 8,
      yMargin: 8,

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

    super( timeSpeedProperty, TimeSpeed.NORMAL, TimeSpeed.FAST, options );

    // Create a Studio link to the model Property
    this.addLinkedElement( timeSpeedProperty, {
      tandem: options.tandem.createTandem( 'timeSpeedProperty' )
    } );
  }
}

naturalSelection.register( 'FastForwardButton', FastForwardButton );
export default FastForwardButton;