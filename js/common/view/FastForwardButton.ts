// Copyright 2020-2022, University of Colorado Boulder

/*
 * FastForwardButton is the fast-forward button. To make the sim run faster, press and hold this button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import { Path } from '../../../../scenery/js/imports.js';
import ButtonModel from '../../../../sun/js/buttons/ButtonModel.js';
import RoundMomentaryButton, { RoundMomentaryButtonOptions } from '../../../../sun/js/buttons/RoundMomentaryButton.js';
import naturalSelection from '../../naturalSelection.js';

type SelfOptions = EmptySelfOptions;

type FastForwardButtonOptions = SelfOptions &
  StrictOmit<RoundMomentaryButtonOptions, 'content'> &
  PickRequired<RoundMomentaryButtonOptions, 'tandem'>;

export default class FastForwardButton extends RoundMomentaryButton<TimeSpeed> {

  public readonly fastForwardButtonModel: ButtonModel;

  public constructor( timeSpeedProperty: EnumerationProperty<TimeSpeed>, providedOptions: FastForwardButtonOptions ) {

    const options = optionize<FastForwardButtonOptions, SelfOptions, RoundMomentaryButtonOptions>()( {

      // RoundMomentaryButtonOptions
      radius: 16,
      xMargin: 8,
      yMargin: 8
    }, providedOptions );

    const radius = options.radius!;
    assert && assert( radius !== null );

    // Two right-pointing arrow heads, drawn clockwise from the top-left corner.
    const fastForwardShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( radius / 2, radius / 2 )
      .lineTo( radius / 2, 0 )
      .lineTo( radius, radius / 2 )
      .lineTo( radius / 2, radius )
      .lineTo( radius / 2, radius / 2 )
      .lineTo( 0, radius )
      .close();

    options.content = new Path( fastForwardShape, {
      fill: 'black'
    } );

    super( timeSpeedProperty, TimeSpeed.NORMAL, TimeSpeed.FAST, options );

    this.fastForwardButtonModel = this.buttonModel;

    this.addLinkedElement( timeSpeedProperty, {
      tandem: options.tandem.createTandem( 'timeSpeedProperty' )
    } );
  }
}

naturalSelection.register( 'FastForwardButton', FastForwardButton );