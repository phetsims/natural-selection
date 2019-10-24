// Copyright 2019, University of Colorado Boulder

/**
 * CancelMutationButton is the button that appears in the 'Mutation Coming' alert, used to cancel a mutation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const RoundPushButton = require( 'SUN/buttons/RoundPushButton' );

  class CancelMutationButton extends RoundPushButton {

    constructor() {

      super( {

        // so we see only the icon
        minXMargin: 0,
        minYMargin: 0,
        baseColor: 'transparent',

        // red 'x' inside a circle
        content: new FontAwesomeNode( 'times_circle_regular', {
          fill: PhetColorScheme.RED_COLORBLIND,
          scale: 1.4,
          cursor: 'pointer'
        } ),

        listener: () => {
          //TODO cancel mutation
        }
      } );
    }
  }

  return naturalSelection.register( 'CancelMutationButton', CancelMutationButton );
} );