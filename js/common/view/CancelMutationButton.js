// Copyright 2019-2020, University of Colorado Boulder

/**
 * CancelMutationButton is the button that appears in the 'Mutation Coming' alert, used to cancel a mutation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import RoundPushButton from '../../../../sun/js/buttons/RoundPushButton.js';
import FontAwesomeNode from '../../../../sun/js/FontAwesomeNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';

class CancelMutationButton extends RoundPushButton {

  constructor( options ) {

    options = merge( {

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

      touchAreaDilation: 8,
      mouseAreaDilation: 4,

      // phet-io
      tandem: Tandem.OPTIONAL // because we don't want to instrument this button
    }, options );

    super( options );
  }
}

naturalSelection.register( 'CancelMutationButton', CancelMutationButton );
export default CancelMutationButton;