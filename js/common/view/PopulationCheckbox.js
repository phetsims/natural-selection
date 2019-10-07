// Copyright 2019, University of Colorado Boulder

/**
 * PopulationCheckbox is a checkbox in the control panel for the Population graph.
 * It serves as a legend (showing the color and line style) and a means of controlling visibility (checkbox).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Line = require( 'SCENERY/nodes/Line' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const LINE_LENGTH = 25;

  class PopulationCheckbox extends Checkbox {

    /**
     * @param {Property.<boolean>} property
     * @param {string} textString
     * @param {Object} [options]
     */
    constructor( property, textString, options ) {

      options = _.extend( {}, NaturalSelectionConstants.CHECK_BOX_OPTIONS, {

        // options passed to Line
        lineOptions: {
          stroke: 'black',
          lineWidth: 3,
          lineDash: []
        }
      }, options );

      const lineNode = new Line( 0, 0, LINE_LENGTH, 0, options.lineOptions );

      const textNode = new Text( textString, {
        font: NaturalSelectionConstants.CHECKBOX_FONT
      } );

      const content = new HBox( {
        spacing: 5,
        children: [ lineNode, textNode ]
      }  );

      super( content, property, options );
    }
  }

  return naturalSelection.register( 'PopulationCheckbox', PopulationCheckbox );
} );