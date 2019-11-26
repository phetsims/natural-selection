// Copyright 2019, University of Colorado Boulder

/**
 * EnvironmentRadioButtonGroup is the radio button group for choosing the abiotic component of the environment.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Environments = require( 'NATURAL_SELECTION/common/model/Environments' );
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  const ICON_X_MARGIN = 8;
  const ICON_Y_MARGIN = 6;

  class EnvironmentRadioButtonGroup extends RadioButtonGroup {

    /**
     * @param {EnumerationProperty.<Environments>} environmentProperty
     * @param {Object} [options]
     */
    constructor( environmentProperty, options ) {

      options = merge( {}, {

        // RadioButtonGroup options
        orientation: 'horizontal',
        spacing: 8,
        cornerRadius: NaturalSelectionConstants.CORNER_RADIUS,
        selectedStroke: NaturalSelectionColors.RADIO_BUTTON_SELECTED_STROKE,
        deselectedStroke: NaturalSelectionColors.RADIO_BUTTON_DESELECTED_STROKE,
        selectedLineWidth: 5,
        deselectedLineWidth: 1.5,
        buttonContentXMargin: 0, // Set to 0 because we will create our own backgrounds, see below.
        buttonContentYMargin: 0  // Set to 0 because we will create our own backgrounds, see below.
      }, options );

      // icons
      const iconOptions = { scale: 2, fill: 'white' };
      const sunIcon = new FontAwesomeNode( 'sun_solid', iconOptions );
      const snowflakeIcon = new FontAwesomeNode( 'snowflake', iconOptions );

      // RadioButtonGroup does not support different colors for radio buttons in the same group.
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
        { value: Environments.EQUATOR, node: equatorButtonContent },
        { value: Environments.ARCTIC, node: arcticButtonContent }
      ];

      super( environmentProperty, content, options );
    }
  }

  return naturalSelection.register( 'EnvironmentRadioButtonGroup', EnvironmentRadioButtonGroup );
} );