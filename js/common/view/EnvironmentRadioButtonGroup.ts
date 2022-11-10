// Copyright 2019-2022, University of Colorado Boulder

/**
 * EnvironmentRadioButtonGroup is the radio button group for choosing the environment that the bunnies live in.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Node, NodeTranslationOptions, Path, Rectangle } from '../../../../scenery/js/imports.js';
import snowflakeSolidShape from '../../../../sherpa/js/fontawesome-5/snowflakeSolidShape.js';
import sunSolidShape from '../../../../sherpa/js/fontawesome-5/sunSolidShape.js';
import RectangularRadioButton from '../../../../sun/js/buttons/RectangularRadioButton.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import Environment from '../model/Environment.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

// constants
const ICON_X_MARGIN = 8;
const ICON_Y_MARGIN = 6;

type SelfOptions = EmptySelfOptions;

type EnvironmentRadioButtonGroupOptions = SelfOptions & NodeTranslationOptions &
  PickRequired<RectangularRadioButtonGroupOptions, 'tandem'>;

export default class EnvironmentRadioButtonGroup extends RectangularRadioButtonGroup<Environment> {

  public constructor( environmentProperty: EnumerationProperty<Environment>,
                      providedOptions: EnvironmentRadioButtonGroupOptions ) {

    const options = optionize<EnvironmentRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {

      // RectangularRadioButtonGroupOptions
      orientation: 'horizontal',
      spacing: 8,
      radioButtonOptions: {
        cornerRadius: NaturalSelectionConstants.CORNER_RADIUS,
        xMargin: 0, // Set to 0 because we will create our own backgrounds, see below.
        yMargin: 0,  // Set to 0 because we will create our own backgrounds, see below.
        buttonAppearanceStrategyOptions: {
          selectedStroke: NaturalSelectionColors.RADIO_BUTTON_SELECTED_STROKE,
          deselectedStroke: NaturalSelectionColors.RADIO_BUTTON_DESELECTED_STROKE,
          selectedLineWidth: 5,
          deselectedLineWidth: 1.5
        }
      },
      enabledPropertyOptions: {
        phetioReadOnly: true // see https://github.com/phetsims/natural-selection/issues/296
      }
    }, providedOptions );

    // icons
    const iconOptions = { scale: 0.05, fill: 'white' };
    const sunIcon = new Path( sunSolidShape, iconOptions );
    const snowflakeIcon = new Path( snowflakeSolidShape, iconOptions );

    // RectangularRadioButtonGroup does not support different colors for radio buttons in the same group.
    // So we create our own backgrounds, with a cornerRadius that matches options.cornerRadius.
    const buttonWidth = _.maxBy( [ sunIcon, snowflakeIcon ], icon => icon.width )!.width + ( 2 * ICON_X_MARGIN );
    const buttonHeight = _.maxBy( [ sunIcon, snowflakeIcon ], icon => icon.height )!.height + ( 2 * ICON_Y_MARGIN );
    const equatorButtonBackground = new Rectangle( 0, 0, buttonWidth, buttonHeight, {
      cornerRadius: options.radioButtonOptions.cornerRadius,
      fill: NaturalSelectionColors.EQUATOR_BUTTON_FILL,
      center: sunIcon.center
    } );
    const arcticButtonBackground = new Rectangle( 0, 0, buttonWidth, buttonHeight, {
      cornerRadius: options.radioButtonOptions.cornerRadius,
      fill: NaturalSelectionColors.ARCTIC_BUTTON_FILL,
      center: snowflakeIcon.center
    } );

    // icons on backgrounds
    const equatorButtonContent = new Node( { children: [ equatorButtonBackground, sunIcon ] } );
    const arcticButtonContent = new Node( { children: [ arcticButtonBackground, snowflakeIcon ] } );

    // description of the buttons
    const content = [
      {
        value: Environment.EQUATOR,
        createNode: ( tandem: Tandem ) => equatorButtonContent,
        tandemName: `equator${RectangularRadioButton.TANDEM_NAME_SUFFIX}`
      },
      {
        value: Environment.ARCTIC,
        createNode: ( tandem: Tandem ) => arcticButtonContent,
        tandemName: `arctic${RectangularRadioButton.TANDEM_NAME_SUFFIX}`
      }
    ];

    super( environmentProperty, content, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'EnvironmentRadioButtonGroup', EnvironmentRadioButtonGroup );