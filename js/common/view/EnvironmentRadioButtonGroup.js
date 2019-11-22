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
        orientation: 'horizontal',
        spacing: 8,
        cornerRadius: 5,
        selectedStroke: 'rgb( 254, 225, 5 )',
        selectedLineWidth: NaturalSelectionConstants.CORNER_RADIUS,
        deselectedLineWidth: 1,
        deselectedButtonOpacity: 0.2,

        // Set to 0 because we will create our own backgrounds, see below.
        buttonContentXMargin: 0,
        buttonContentYMargin: 0
      }, options );

      const fontAwesomeOptions = { scale: 2, fill: 'white' };

      // icons
      const sunIcon = new FontAwesomeNode( 'sun_solid', fontAwesomeOptions );
      const snowflakeIcon = new FontAwesomeNode( 'snowflake', fontAwesomeOptions );

      // RadioButtonGroup does not support different colors for radio buttons in the same group. So here we
      // create our own backgrounds, with a cornerRadius that matches options.cornerRadius.
      const buttonWidth = _.maxBy( [ sunIcon, snowflakeIcon ], icon => icon.width ).width + ( 2 * ICON_X_MARGIN );
      const buttonHeight = _.maxBy( [ sunIcon, snowflakeIcon ], icon => icon.height ).height + ( 2 * ICON_Y_MARGIN );
      const sunBackground = new Rectangle( 0, 0, buttonWidth, buttonHeight, {
        cornerRadius: options.cornerRadius,
        fill: 'rgb( 207, 125, 66 )',
        center: sunIcon.center
      } );
      const snowflakeBackground = new Rectangle( 0, 0, buttonWidth, buttonHeight, {
        cornerRadius: options.cornerRadius,
        fill: 'rgb( 54, 137, 239 )',
        center: snowflakeIcon.center
      } );

      // icons on backgrounds
      const sunParent = new Node( { children: [ sunBackground, sunIcon ] } );
      const snowflakeParent = new Node( { children: [ snowflakeBackground, snowflakeIcon ] } );
      
      // Create the description of the buttons
      const content = [
        { value: Environments.EQUATOR, node: sunParent },
        { value: Environments.ARCTIC, node: snowflakeParent }
      ];

      super( environmentProperty, content, options );
    }
  }

  return naturalSelection.register( 'EnvironmentRadioButtonGroup', EnvironmentRadioButtonGroup );
} );