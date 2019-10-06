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
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  const populationString = require( 'string!NATURAL_SELECTION/population' );
  const proportionString = require( 'string!NATURAL_SELECTION/proportion' );
  const pedigreeString = require( 'string!NATURAL_SELECTION/pedigree' );

  // constants
  const TEXT_OPTIONS = { font: new PhetFont( 14 ) };

  class GraphRadioButtonGroup extends VerticalAquaRadioButtonGroup {

    /**
     * @param {EnumerationProperty} graphProperty
     * @param {Object} [options]
     */
    constructor( graphProperty, options ) {

      options = _.extend( {
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