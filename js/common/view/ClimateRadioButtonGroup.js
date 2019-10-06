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
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const TEXT_OPTIONS = { font: new PhetFont( 14 ) };

  class ClimateRadioButtonGroup extends RadioButtonGroup {

    /**
     * @param {EnumerationProperty} climateProperty
     * @param {Object} [options]
     */
    constructor( climateProperty, options ) {

      options = _.extend( {
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