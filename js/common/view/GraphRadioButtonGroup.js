// Copyright 2019, University of Colorado Boulder

/**
 * GraphRadioButtonGroup is the radio button group for selecting a graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Graphs = require( 'NATURAL_SELECTION/common/view/Graphs' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  const populationString = require( 'string!NATURAL_SELECTION/population' );
  const proportionString = require( 'string!NATURAL_SELECTION/proportion' );
  const pedigreeString = require( 'string!NATURAL_SELECTION/pedigree' );

  // constants
  const TEXT_OPTIONS = { font: NaturalSelectionConstants.RADIO_BUTTON_FONT };

  class GraphRadioButtonGroup extends VerticalAquaRadioButtonGroup {

    /**
     * @param {EnumerationProperty} graphProperty
     * @param {Object} [options]
     */
    constructor( graphProperty, options ) {

      options = _.extend( {
        radius: 8,
        xSpacing: 10,
        spacing: 12
      }, options );

      // Create the description of the buttons
      const items = [
        { value: Graphs.POPULATION, node: new Text( populationString, TEXT_OPTIONS ) },
        { value: Graphs.PROPORTION, node: new Text( proportionString, TEXT_OPTIONS ) },
        { value: Graphs.PEDIGREE, node: new Text( pedigreeString, TEXT_OPTIONS ) }
      ];

      super( graphProperty, items, options );
    }
  }

  return naturalSelection.register( 'GraphRadioButtonGroup', GraphRadioButtonGroup );
} );