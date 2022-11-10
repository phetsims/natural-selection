// Copyright 2019-2022, University of Colorado Boulder

/**
 * CancelMutationButton is the button that appears in the 'Mutation Coming' alert, used to cancel a mutation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import { Path } from '../../../../scenery/js/imports.js';
import timesCircleRegularShape from '../../../../sherpa/js/fontawesome-5/timesCircleRegularShape.js';
import RoundPushButton, { RoundPushButtonOptions } from '../../../../sun/js/buttons/RoundPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';

type SelfOptions = EmptySelfOptions;

type CancelMutationButtonOptions = SelfOptions & PickRequired<RoundPushButtonOptions, 'listener'>;

export default class CancelMutationButton extends RoundPushButton {

  public constructor( providedOptions: CancelMutationButtonOptions ) {

    // red 'x' inside a circle
    const content = new Path( timesCircleRegularShape, {
      fill: PhetColorScheme.RED_COLORBLIND,
      scale: 0.035,
      cursor: 'pointer'
    } );

    const options = optionize<CancelMutationButtonOptions, SelfOptions, RoundPushButtonOptions>()( {

      // RoundPushButtonOptions
      content: content,
      xMargin: 0,
      yMargin: 0,
      baseColor: 'transparent', // so we see only the icon
      touchAreaDilation: 8,
      mouseAreaDilation: 4,
      tandem: Tandem.OPTIONAL // because we don't want to instrument this button
    }, providedOptions );

    super( options );
  }
}

naturalSelection.register( 'CancelMutationButton', CancelMutationButton );