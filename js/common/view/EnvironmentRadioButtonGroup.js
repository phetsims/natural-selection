// Copyright 2019-2020, University of Colorado Boulder

/**
 * EnvironmentRadioButtonGroup is the radio button group for choosing the environment that the bunnies live in.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import FontAwesomeNode from '../../../../sun/js/FontAwesomeNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import Environment from '../model/Environment.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

// constants
const ICON_X_MARGIN = 8;
const ICON_Y_MARGIN = 6;

class EnvironmentRadioButtonGroup extends RectangularRadioButtonGroup {

  /**
   * @param {EnumerationProperty.<Environment>} environmentProperty
   * @param {Object} [options]
   */
  constructor( environmentProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( environmentProperty, Environment );

    options = merge( {}, {

      // RectangularRadioButtonGroup options
      orientation: 'horizontal',
      spacing: 8,
      cornerRadius: NaturalSelectionConstants.CORNER_RADIUS,
      selectedStroke: NaturalSelectionColors.RADIO_BUTTON_SELECTED_STROKE,
      deselectedStroke: NaturalSelectionColors.RADIO_BUTTON_DESELECTED_STROKE,
      selectedLineWidth: 5,
      deselectedLineWidth: 1.5,
      buttonContentXMargin: 0, // Set to 0 because we will create our own backgrounds, see below.
      buttonContentYMargin: 0,  // Set to 0 because we will create our own backgrounds, see below.

      // phet-io
      tandem: Tandem.REQUIRED,
      enabledPropertyOptions: {
        phetioReadOnly: true // see https://github.com/phetsims/natural-selection/issues/296
      }
    }, options );

    // icons
    const iconOptions = { scale: 2, fill: 'white' };
    const sunIcon = new FontAwesomeNode( 'sun_solid', iconOptions );
    const snowflakeIcon = new FontAwesomeNode( 'snowflake', iconOptions );

    // RectangularRadioButtonGroup does not support different colors for radio buttons in the same group.
    // So we create our own backgrounds, with a cornerRadius that matches options.cornerRadius.
    const buttonWidth = _.maxBy( [ sunIcon, snowflakeIcon ], icon => icon.width ).width + ( 2 * ICON_X_MARGIN );
    const buttonHeight = _.maxBy( [ sunIcon, snowflakeIcon ], icon => icon.height ).height + ( 2 * ICON_Y_MARGIN );
    const equatorButtonBackground = new Rectangle( 0, 0, buttonWidth, buttonHeight, {
      cornerRadius: options.cornerRadius,
      fill: NaturalSelectionColors.EQUATOR_BUTTON_FILL,
      center: sunIcon.center
    } );
    const arcticButtonBackground = new Rectangle( 0, 0, buttonWidth, buttonHeight, {
      cornerRadius: options.cornerRadius,
      fill: NaturalSelectionColors.ARCTIC_BUTTON_FILL,
      center: snowflakeIcon.center
    } );

    // icons on backgrounds
    const equatorButtonContent = new Node( { children: [ equatorButtonBackground, sunIcon ] } );
    const arcticButtonContent = new Node( { children: [ arcticButtonBackground, snowflakeIcon ] } );

    // description of the buttons
    const content = [
      { value: Environment.EQUATOR, node: equatorButtonContent, tandemName: 'equatorRadioButton' },
      { value: Environment.ARCTIC, node: arcticButtonContent, tandemName: 'arcticRadioButton' }
    ];

    super( environmentProperty, content, options );
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

naturalSelection.register( 'EnvironmentRadioButtonGroup', EnvironmentRadioButtonGroup );
export default EnvironmentRadioButtonGroup;