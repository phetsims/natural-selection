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
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Text = require( 'SCENERY/nodes/Text' );

  class PopulationCheckbox extends Checkbox {

    /**
     * @param {Property.<boolean>} property
     * @param {string} labelString
     * @param {Color|string} color
     * @param {boolean} isMutation
     * @param {Object} [options]
     */
    constructor( property, labelString, color, isMutation, options ) {

      options = merge( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, options );

      const lineNode = new Line( 0, 0, 28, 0, {
        stroke: color,
        lineWidth: 3,
        lineDash: isMutation ? [ 3, 3 ] : []  // mutations use a dashed line
      } );

      const textNode = new Text( labelString, {
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