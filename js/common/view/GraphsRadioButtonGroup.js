// Copyright 2019, University of Colorado Boulder

/**
 * GraphsRadioButtonGroup is the radio button group for selecting which of the graphs is visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Graphs = require( 'NATURAL_SELECTION/common/view/Graphs' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  const populationString = require( 'string!NATURAL_SELECTION/population' );
  const proportionsString = require( 'string!NATURAL_SELECTION/proportions' );
  const pedigreeString = require( 'string!NATURAL_SELECTION/pedigree' );

  // constants
  const TEXT_OPTIONS = {
    font: NaturalSelectionConstants.RADIO_BUTTON_FONT,
    maxWidth: 175 // determined empirically
  };

  class GraphsRadioButtonGroup extends VerticalAquaRadioButtonGroup {

    /**
     * @param {EnumerationProperty.<Graphs>} graphProperty
     * @param {Object} [options]
     */
    constructor( graphProperty, options ) {

      options = merge( {
        radius: 8,
        xSpacing: 10,
        spacing: 12,

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      // Create the description of the buttons
      const items = [

        // Population
        {
          value: Graphs.POPULATION,
          node: new Text( populationString, TEXT_OPTIONS ),
          tandemName: 'populationRadioButton'
        },

        // Proportions
        {
          value: Graphs.PROPORTIONS,
          node: new Text( proportionsString, TEXT_OPTIONS ),
          tandemName: 'proportionsRadioButton'
        },

        // Pedigree
        {
          value: Graphs.PEDIGREE,
          node: new Text( pedigreeString, TEXT_OPTIONS ),
          tandemName: 'pedigreeRadioButton'
        }
      ];

      super( graphProperty, items, options );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'GraphsRadioButtonGroup does not support dispose' );
    }
  }

  return naturalSelection.register( 'GraphsRadioButtonGroup', GraphsRadioButtonGroup );
} );