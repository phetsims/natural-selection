// Copyright 2019, University of Colorado Boulder

/**
 * ClimateRadioButtonGroup is the radio button group for choosing a climate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Climates = require( 'NATURAL_SELECTION/common/model/Climates' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const TEXT_OPTIONS = { font: NaturalSelectionConstants.RADIO_BUTTON_FONT };

  class ClimateRadioButtonGroup extends RadioButtonGroup {

    /**
     * @param {EnumerationProperty} climateProperty
     * @param {Object} [options]
     */
    constructor( climateProperty, options ) {

      options = _.extend( {}, NaturalSelectionConstants.RADIO_BUTTON_GROUP_OPTIONS, {
        orientation: 'horizontal'
      }, options );

      // Create the description of the buttons
      const content = [
        { value: Climates.EQUATOR, node: new Text( 'Equator', TEXT_OPTIONS ) },
        { value: Climates.ARCTIC, node: new Text( 'Arctic', TEXT_OPTIONS ) }
      ];

      super( climateProperty, content, options );
    }
  }

  return naturalSelection.register( 'ClimateRadioButtonGroup', ClimateRadioButtonGroup );
} );